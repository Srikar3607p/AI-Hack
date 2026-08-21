import { Complaint } from '../models/Complaint.js';
import { Department } from '../models/Department.js';
import { Team } from '../models/Team.js';
import { ROLES, COMPLAINT_STATUS, PRIORITY_LEVELS } from '../config/constants.js';
import { analyzeComplaintAI, verifyResolutionAI } from '../services/aiService.js';
import { calculateSLA } from '../services/slaCalculator.js';
import { logAuditEvent } from '../services/auditService.js';

// Helper to generate formatted Complaint ID e.g. CMP-2026-1042
const generateComplaintId = async () => {
  const count = await Complaint.countDocuments();
  const year = new Date().getFullYear();
  return `CMP-${year}-${String(1001 + count).padStart(4, '0')}`;
};

export const createComplaint = async (req, res, next) => {
  try {
    const {
      title,
      description,
      voiceTranscript,
      latitude,
      longitude,
      address,
      ward,
      zone
    } = req.body;

    if (!description || description.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a detailed description of the civic problem (minimum 5 characters).'
      });
    }

    // Process uploaded images
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Parse location
    const lat = latitude ? parseFloat(latitude) : 12.9716;
    const lon = longitude ? parseFloat(longitude) : 77.5946;
    const locationData = {
      type: 'Point',
      coordinates: [lon, lat],
      address: address || 'Mapped Location, Civic Zone',
      ward: ward || 'Ward 12',
      zone: zone || 'Central Zone'
    };

    // Fetch existing recent complaints for duplicate check
    const existingComplaints = await Complaint.find({
      status: { $nin: [COMPLAINT_STATUS.RESOLVED, COMPLAINT_STATUS.CLOSED, COMPLAINT_STATUS.REJECTED] }
    }).select('complaintId title description category location').limit(20);

    // Call AI Orchestration Service (with 100% resilient fallback)
    const aiResult = await analyzeComplaintAI({
      title: title || description.slice(0, 40),
      description,
      voiceTranscript: voiceTranscript || '',
      images,
      location: locationData,
      existingComplaints
    });

    const category = aiResult.intake?.category || 'Other';
    const issueType = aiResult.intake?.issueType || 'Civic Grievance';
    const priority = aiResult.priority?.priority || PRIORITY_LEVELS.MEDIUM;
    const priorityScore = aiResult.priority?.priorityScore || 50;
    const priorityExplanation = aiResult.priority?.explanation || 'Medium priority assessment.';
    const aiSummary = aiResult.summary || description.slice(0, 100);

    // Resolve Department & Team in DB
    let departmentDoc = await Department.findOne({
      $or: [
        { name: aiResult.routing?.department },
        { categories: category }
      ]
    });

    if (!departmentDoc) {
      departmentDoc = await Department.findOne({ code: 'PUB_FAC' }) || await Department.findOne();
    }

    let teamDoc = null;
    if (departmentDoc) {
      teamDoc = await Team.findOne({ department: departmentDoc._id }) || null;
    }

    // Calculate SLA
    const sla = calculateSLA(priority, departmentDoc);

    const complaintId = await generateComplaintId();

    const timeline = [
      {
        status: COMPLAINT_STATUS.SUBMITTED,
        changedBy: req.user._id,
        changedByName: req.user.name,
        changedByRole: req.user.role,
        timestamp: new Date(),
        notes: 'Complaint submitted by citizen.',
        action: 'CITIZEN_SUBMIT'
      },
      {
        status: COMPLAINT_STATUS.AI_PROCESSING,
        changedByName: 'AI Orchestrator',
        changedByRole: 'SYSTEM_AGENT',
        timestamp: new Date(),
        notes: `AI Classified into '${category}' (${issueType}) with ${priority} Priority (${priorityScore}/100). Routed to ${departmentDoc?.name || 'Department'}. [${aiResult.analysisType}]`,
        action: 'AI_INTAKE_ANALYSIS'
      }
    ];

    if (departmentDoc) {
      timeline.push({
        status: COMPLAINT_STATUS.ASSIGNED,
        changedByName: 'Routing Agent',
        changedByRole: 'SYSTEM_AGENT',
        timestamp: new Date(),
        notes: `Assigned to ${departmentDoc.name} (${teamDoc ? teamDoc.name : 'Rapid Response Unit'}).`,
        action: 'DEPARTMENT_ASSIGNMENT'
      });
    }

    const complaint = await Complaint.create({
      complaintId,
      citizen: req.user._id,
      title: title || aiSummary.slice(0, 60),
      description,
      voiceTranscript: voiceTranscript || '',
      images,
      location: locationData,
      category,
      issueType,
      priority,
      priorityScore,
      priorityFactors: aiResult.priority?.factors || { impact: 50, urgency: 50, affectedCitizens: 50, duration: 20 },
      priorityExplanation,
      department: departmentDoc?._id || null,
      assignedTeam: teamDoc?._id || null,
      status: departmentDoc ? COMPLAINT_STATUS.ASSIGNED : COMPLAINT_STATUS.SUBMITTED,
      sla,
      aiAnalysis: {
        summary: aiSummary,
        safetyRisk: aiResult.intake?.safetyRisk || 'Low',
        confidenceScore: aiResult.intake?.confidence || 0.85,
        detectedLabels: aiResult.intake?.detectedLabels || [category],
        isAiAssisted: aiResult.isAiAssisted,
        analysisType: aiResult.analysisType,
        duplicateInfo: aiResult.duplicateInfo || { isDuplicate: false, similarityScore: 0 }
      },
      timeline
    });

    await logAuditEvent({
      action: 'COMPLAINT_CREATED',
      user: req.user,
      targetResource: 'Complaint',
      targetId: complaint.complaintId,
      details: { category, priority, department: departmentDoc?.name, analysisType: aiResult.analysisType }
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email phone')
      .populate('department', 'name code')
      .populate('assignedTeam', 'name zone ward');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted and analyzed by AI Orchestrator successfully.',
      complaint: populated
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaints = async (req, res, next) => {
  try {
    const { status, priority, category, search, department, isOverdue, isDuplicate, limit = 50, page = 1 } = req.query;

    const query = {};

    // Role-based scoping
    if (req.user.role === ROLES.CITIZEN) {
      query.citizen = req.user._id;
    } else if (req.user.role === ROLES.OFFICER) {
      if (req.user.department) {
        query.department = req.user.department;
      }
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (department) query.department = department;
    if (isOverdue === 'true') query['sla.isOverdue'] = true;
    if (isDuplicate === 'true') query['aiAnalysis.duplicateInfo.isDuplicate'] = true;

    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.ward': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('citizen', 'name email phone')
      .populate('department', 'name code')
      .populate('assignedTeam', 'name zone ward')
      .populate('assignedOfficer', 'name email');

    const total = await Complaint.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      complaints
    });
  } catch (error) {
    next(error);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { complaintId: id }]
    })
      .populate('citizen', 'name email phone avatar')
      .populate('department', 'name code slaHours')
      .populate('assignedTeam', 'name zone ward leadOfficer')
      .populate('assignedOfficer', 'name email phone')
      .populate('resolution.resolvedBy', 'name email role')
      .populate('reopened.reopenedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    // Role check: Citizen can only view own complaints
    if (req.user.role === ROLES.CITIZEN && complaint.citizen._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this complaint.'
      });
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedOfficerId } = req.body;

    const complaint = await Complaint.findById(id).populate('department');
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    const prevStatus = complaint.status;
    if (status) complaint.status = status;
    if (assignedOfficerId) complaint.assignedOfficer = assignedOfficerId;

    complaint.timeline.push({
      status: status || prevStatus,
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      timestamp: new Date(),
      notes: notes || `Status updated from '${prevStatus}' to '${status}'.`,
      action: 'STATUS_UPDATE'
    });

    await complaint.save();

    await logAuditEvent({
      action: 'COMPLAINT_STATUS_UPDATED',
      user: req.user,
      targetResource: 'Complaint',
      targetId: complaint.complaintId,
      details: { previousStatus: prevStatus, newStatus: status, notes }
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('department', 'name')
      .populate('assignedTeam', 'name')
      .populate('assignedOfficer', 'name email');

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}.`,
      complaint: updated
    });
  } catch (error) {
    next(error);
  }
};

export const submitResolution = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const complaint = await Complaint.findById(id).populate('department assignedTeam');
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (!resolutionNotes || resolutionNotes.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide clear work resolution notes (minimum 10 characters).'
      });
    }

    const afterImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Trigger AI Resolution Verification
    const aiVerif = await verifyResolutionAI({
      complaintDescription: complaint.description,
      category: complaint.category,
      resolutionNotes,
      beforeImages: complaint.images || [],
      afterImages,
      teamName: complaint.assignedTeam?.name || 'Municipal Field Operations'
    });

    complaint.status = COMPLAINT_STATUS.RESOLVED;
    complaint.resolution = {
      resolutionNotes,
      beforeImages: complaint.images || [],
      afterImages,
      resolvedBy: req.user._id,
      resolvedAt: new Date(),
      aiVerification: {
        verified: aiVerif.verified,
        confidence: aiVerif.confidence,
        notes: aiVerif.verificationNotes
      },
      citizenExplanation: aiVerif.citizenExplanation
    };

    complaint.timeline.push({
      status: COMPLAINT_STATUS.RESOLVED,
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      timestamp: new Date(),
      notes: `Resolution submitted: "${resolutionNotes}". AI Verification: ${aiVerif.verified ? 'Verified' : 'Flagged for Review'}.`,
      action: 'RESOLUTION_SUBMITTED'
    });

    await complaint.save();

    await logAuditEvent({
      action: 'COMPLAINT_RESOLVED',
      user: req.user,
      targetResource: 'Complaint',
      targetId: complaint.complaintId,
      details: { resolutionNotes, verified: aiVerif.verified }
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('department', 'name')
      .populate('assignedTeam', 'name')
      .populate('resolution.resolvedBy', 'name');

    res.status(200).json({
      success: true,
      message: 'Resolution submitted and verified by AI successfully.',
      complaint: updated
    });
  } catch (error) {
    next(error);
  }
};

export const reopenComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for reopening the complaint.'
      });
    }

    const complaint = await Complaint.findById(id).populate('department');
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (complaint.citizen.toString() !== req.user._id.toString() && req.user.role === ROLES.CITIZEN) {
      return res.status(403).json({ success: false, message: 'Only the reporting citizen or admin can reopen this complaint.' });
    }

    const reopenCount = (complaint.reopened?.reopenCount || 0) + 1;

    complaint.status = COMPLAINT_STATUS.IN_PROGRESS;
    complaint.reopened = {
      isReopened: true,
      reopenedAt: new Date(),
      reopenCount,
      reopenReason: reason,
      reopenedBy: req.user._id
    };

    complaint.timeline.push({
      status: COMPLAINT_STATUS.IN_PROGRESS,
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      timestamp: new Date(),
      notes: `Complaint reopened by citizen (#${reopenCount}): "${reason}"`,
      action: 'COMPLAINT_REOPENED'
    });

    await complaint.save();

    await logAuditEvent({
      action: 'COMPLAINT_REOPENED',
      user: req.user,
      targetResource: 'Complaint',
      targetId: complaint.complaintId,
      details: { reopenReason: reason, reopenCount }
    });

    res.status(200).json({
      success: true,
      message: 'Complaint reopened and returned to In Progress queue.',
      complaint
    });
  } catch (error) {
    next(error);
  }
};

export const reassignComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { departmentId, teamId, assignedOfficerId, reason } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    let deptName = '';
    if (departmentId) {
      complaint.department = departmentId;
      const dept = await Department.findById(departmentId);
      deptName = dept ? dept.name : '';
    }
    if (teamId) complaint.assignedTeam = teamId;
    if (assignedOfficerId) complaint.assignedOfficer = assignedOfficerId;

    complaint.timeline.push({
      status: complaint.status,
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      timestamp: new Date(),
      notes: `Reassigned by admin to ${deptName || 'new unit'}. Reason: ${reason || 'Administrative routing override'}`,
      action: 'ADMIN_REASSIGN'
    });

    await complaint.save();

    await logAuditEvent({
      action: 'COMPLAINT_REASSIGNED',
      user: req.user,
      targetResource: 'Complaint',
      targetId: complaint.complaintId,
      details: { departmentId, teamId, reason }
    });

    const updated = await Complaint.findById(complaint._id)
      .populate('department', 'name')
      .populate('assignedTeam', 'name')
      .populate('assignedOfficer', 'name');

    res.status(200).json({
      success: true,
      message: 'Complaint reassigned successfully.',
      complaint: updated
    });
  } catch (error) {
    next(error);
  }
};
