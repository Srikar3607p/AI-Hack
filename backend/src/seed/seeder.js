import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Team } from '../models/Team.js';
import { Complaint } from '../models/Complaint.js';
import { ComplaintCluster } from '../models/ComplaintCluster.js';
import { AuditLog } from '../models/AuditLog.js';
import { EscalationRule } from '../models/EscalationRule.js';
import { demoDepartments, demoEscalationRules } from './seedData.js';
import { ROLES, COMPLAINT_STATUS, PRIORITY_LEVELS } from '../config/constants.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Connecting to database...');
    await connectDB();

    console.log('[Seeder] Clearing existing data...');
    await User.deleteMany();
    await Department.deleteMany();
    await Team.deleteMany();
    await Complaint.deleteMany();
    await ComplaintCluster.deleteMany();
    await AuditLog.deleteMany();
    await EscalationRule.deleteMany();

    console.log('[Seeder] Seeding Departments...');
    const createdDepts = await Department.insertMany(demoDepartments);
    const deptMap = {};
    createdDepts.forEach(d => { deptMap[d.code] = d; });

    console.log('[Seeder] Seeding Escalation Rules...');
    await EscalationRule.insertMany(demoEscalationRules);

    console.log('[Seeder] Seeding Users...');
    // Create Users
    const citizen1 = await User.create({
      name: 'Rohan Sharma',
      email: 'citizen@civicaid.gov',
      password: 'Citizen@123',
      phone: '+91 98765 43210',
      role: ROLES.CITIZEN,
      isPhoneVerified: true
    });

    const citizen2 = await User.create({
      name: 'Anita Rao',
      email: 'anita.rao@civicaid.gov',
      password: 'Citizen@123',
      phone: '+91 98765 43211',
      role: ROLES.CITIZEN,
      isPhoneVerified: true
    });

    const officerRoads = await User.create({
      name: 'Vikram Verma',
      email: 'officer.roads@civicaid.gov',
      password: 'Officer@123',
      phone: '+91 98765 43220',
      role: ROLES.OFFICER,
      department: deptMap['ROADS']._id,
      isPhoneVerified: true
    });

    const officerSanitation = await User.create({
      name: 'Pooja Iyer',
      email: 'officer.sanitation@civicaid.gov',
      password: 'Officer@123',
      phone: '+91 98765 43221',
      role: ROLES.OFFICER,
      department: deptMap['SAN']._id,
      isPhoneVerified: true
    });

    const officerDrainage = await User.create({
      name: 'Suresh Kumar',
      email: 'officer.drainage@civicaid.gov',
      password: 'Officer@123',
      phone: '+91 98765 43222',
      role: ROLES.OFFICER,
      department: deptMap['DRAIN']._id,
      isPhoneVerified: true
    });

    const officerElectrical = await User.create({
      name: 'Karthik Nair',
      email: 'officer.electrical@civicaid.gov',
      password: 'Officer@123',
      phone: '+91 98765 43223',
      role: ROLES.OFFICER,
      department: deptMap['ELEC']._id,
      isPhoneVerified: true
    });

    const admin = await User.create({
      name: 'Dr. Meera Nambiar',
      email: 'admin@civicaid.gov',
      password: 'Admin@123',
      phone: '+91 98765 43230',
      role: ROLES.ADMIN,
      isPhoneVerified: true
    });

    const superAdmin = await User.create({
      name: 'Municipal Commissioner Rajesh Patil',
      email: 'superadmin@civicaid.gov',
      password: 'SuperAdmin@123',
      phone: '+91 98765 43240',
      role: ROLES.SUPER_ADMIN,
      isPhoneVerified: true
    });

    console.log('[Seeder] Seeding Teams...');
    const teams = await Team.insertMany([
      {
        name: 'Road Maintenance & Pothole Rapid Unit',
        department: deptMap['ROADS']._id,
        zone: 'Central Zone',
        ward: 'Ward 12',
        leadOfficer: officerRoads._id,
        members: [officerRoads._id]
      },
      {
        name: 'Solid Waste & Cleanliness Squad',
        department: deptMap['SAN']._id,
        zone: 'Central Zone',
        ward: 'Ward 12',
        leadOfficer: officerSanitation._id,
        members: [officerSanitation._id]
      },
      {
        name: 'Stormwater & Desilting Response Unit',
        department: deptMap['DRAIN']._id,
        zone: 'East Zone',
        ward: 'Ward 14',
        leadOfficer: officerDrainage._id,
        members: [officerDrainage._id]
      },
      {
        name: 'Pipeline Repair & Supply Ops',
        department: deptMap['WATER']._id,
        zone: 'South Zone',
        ward: 'Ward 8',
        leadOfficer: null,
        members: []
      },
      {
        name: 'Streetlight & Power Maintenance Crew',
        department: deptMap['ELEC']._id,
        zone: 'West Zone',
        ward: 'Ward 5',
        leadOfficer: officerElectrical._id,
        members: [officerElectrical._id]
      },
      {
        name: 'Civic Amenities & Parks Team',
        department: deptMap['PUB_FAC']._id,
        zone: 'North Zone',
        ward: 'Ward 3',
        leadOfficer: null,
        members: []
      }
    ]);

    const teamMap = {};
    teams.forEach(t => { teamMap[t.name] = t; });

    // Link Head Officers to Departments
    await Department.findByIdAndUpdate(deptMap['ROADS']._id, { headOfficer: officerRoads._id });
    await Department.findByIdAndUpdate(deptMap['SAN']._id, { headOfficer: officerSanitation._id });
    await Department.findByIdAndUpdate(deptMap['DRAIN']._id, { headOfficer: officerDrainage._id });
    await Department.findByIdAndUpdate(deptMap['ELEC']._id, { headOfficer: officerElectrical._id });

    // Link Officers to Teams
    await User.findByIdAndUpdate(officerRoads._id, { team: teamMap['Road Maintenance & Pothole Rapid Unit']._id });
    await User.findByIdAndUpdate(officerSanitation._id, { team: teamMap['Solid Waste & Cleanliness Squad']._id });
    await User.findByIdAndUpdate(officerDrainage._id, { team: teamMap['Stormwater & Desilting Response Unit']._id });
    await User.findByIdAndUpdate(officerElectrical._id, { team: teamMap['Streetlight & Power Maintenance Crew']._id });

    console.log('[Seeder] Seeding Realistic Complaints...');

    const now = new Date();
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
    const fourDaysAgo = new Date(Date.now() - 96 * 60 * 60 * 1000);

    const complaintsData = [
      // 1. Critical Pothole near University Entrance (In Progress)
      {
        complaintId: 'CMP-2026-1001',
        citizen: citizen1._id,
        title: 'Large dangerous pothole near university entrance gate',
        description: 'There has been a very large pothole near the university main gate for over 10 days. Many students using two-wheelers are struggling to cross and two people fell yesterday evening.',
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'University Road, Gate 2, Bengaluru',
          ward: 'Ward 12',
          zone: 'Central Zone'
        },
        category: 'Roads & Potholes',
        issueType: 'Deep Asphalt Crater / Traffic Risk',
        priority: PRIORITY_LEVELS.CRITICAL,
        priorityScore: 88,
        priorityFactors: { impact: 90, urgency: 85, affectedCitizens: 90, duration: 80 },
        priorityExplanation: 'Critical priority because the issue creates a high public safety risk on a heavy student commuter corridor and has remained unresolved for multiple days.',
        department: deptMap['ROADS']._id,
        assignedTeam: teamMap['Road Maintenance & Pothole Rapid Unit']._id,
        assignedOfficer: officerRoads._id,
        status: COMPLAINT_STATUS.IN_PROGRESS,
        sla: {
          targetResolutionHours: 24,
          deadline: new Date(now.getTime() + 12 * 60 * 60 * 1000),
          isApproachingDeadline: true,
          isOverdue: false
        },
        aiAnalysis: {
          summary: 'Large pothole near university gate creating urgent safety risk for two-wheelers and students.',
          safetyRisk: 'High',
          confidenceScore: 0.94,
          detectedLabels: ['Road Damage', 'Pothole', 'Safety Hazard', 'University Gate'],
          isAiAssisted: true,
          analysisType: 'AI-assisted',
          duplicateInfo: { isDuplicate: false, similarityScore: 0 }
        },
        timeline: [
          { status: COMPLAINT_STATUS.SUBMITTED, changedBy: citizen1._id, changedByName: 'Rohan Sharma', changedByRole: 'CITIZEN', timestamp: twoDaysAgo, notes: 'Complaint submitted by citizen.' },
          { status: COMPLAINT_STATUS.AI_PROCESSING, changedByName: 'AI Orchestrator', changedByRole: 'SYSTEM_AGENT', timestamp: twoDaysAgo, notes: 'AI classified as Roads & Potholes, Critical Priority (88/100). SLA: 24h.' },
          { status: COMPLAINT_STATUS.ASSIGNED, changedByName: 'Routing Agent', changedByRole: 'SYSTEM_AGENT', timestamp: twoDaysAgo, notes: 'Assigned to Roads & Infrastructure (Road Maintenance & Pothole Rapid Unit).' },
          { status: COMPLAINT_STATUS.ACKNOWLEDGED, changedBy: officerRoads._id, changedByName: 'Vikram Verma', changedByRole: 'OFFICER', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), notes: 'Field inspection completed. Road patch mix equipment dispatched.' },
          { status: COMPLAINT_STATUS.IN_PROGRESS, changedBy: officerRoads._id, changedByName: 'Vikram Verma', changedByRole: 'OFFICER', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), notes: 'Bitumen resurfacing work underway.' }
        ],
        createdAt: twoDaysAgo
      },

      // 2. Open Manhole & Sewage Overflow (Escalated - Overdue)
      {
        complaintId: 'CMP-2026-1002',
        citizen: citizen2._id,
        title: 'Open manhole and sewer overflow in Ward 12 market area',
        description: 'Underground sewer line is completely clogged and raw sewage is overflowing on the pedestrian pathway near the market. The manhole lid is cracked and open.',
        location: {
          type: 'Point',
          coordinates: [77.5955, 12.9722],
          address: 'Central Market Road, Ward 12, Bengaluru',
          ward: 'Ward 12',
          zone: 'Central Zone'
        },
        category: 'Drainage',
        issueType: 'Sewage Overflow & Open Manhole',
        priority: PRIORITY_LEVELS.CRITICAL,
        priorityScore: 94,
        priorityFactors: { impact: 95, urgency: 95, affectedCitizens: 90, duration: 90 },
        priorityExplanation: 'Critical priority because an open manhole in a busy market poses fatal fall hazards and severe sanitation contamination.',
        department: deptMap['DRAIN']._id,
        assignedTeam: teamMap['Stormwater & Desilting Response Unit']._id,
        assignedOfficer: officerDrainage._id,
        status: COMPLAINT_STATUS.ESCALATED,
        sla: {
          targetResolutionHours: 24,
          deadline: threeDaysAgo,
          isApproachingDeadline: false,
          isOverdue: true,
          escalatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          escalationTier: 'Tier 2 - Zonal Officer & Supervisor',
          escalationReason: 'Automated SLA breach: Case exceeded target 24h resolution window by 36 hours.'
        },
        aiAnalysis: {
          summary: 'Open manhole and severe sewer overflow creating hazardous biohazard in Central Market.',
          safetyRisk: 'High',
          confidenceScore: 0.96,
          detectedLabels: ['Open Manhole', 'Sewage Overflow', 'Public Market Hazard'],
          isAiAssisted: true,
          analysisType: 'AI-assisted',
          duplicateInfo: { isDuplicate: false, similarityScore: 0 }
        },
        timeline: [
          { status: COMPLAINT_STATUS.SUBMITTED, changedBy: citizen2._id, changedByName: 'Anita Rao', changedByRole: 'CITIZEN', timestamp: fourDaysAgo, notes: 'Complaint submitted by citizen.' },
          { status: COMPLAINT_STATUS.ASSIGNED, changedByName: 'Routing Agent', changedByRole: 'SYSTEM_AGENT', timestamp: fourDaysAgo, notes: 'Assigned to Drainage Department.' },
          { status: COMPLAINT_STATUS.ESCALATED, changedByName: 'Escalation Intelligence Agent', changedByRole: 'SYSTEM_AGENT', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), notes: 'Automated Escalation triggered: SLA deadline breached by 36h. Alert sent to Zonal Supervisor.', action: 'AUTO_ESCALATED' }
        ],
        createdAt: fourDaysAgo
      },

      // 3. Garbage Accumulation Near Bus Stop (Assigned - High)
      {
        complaintId: 'CMP-2026-1003',
        citizen: citizen1._id,
        title: 'Huge pile of uncollected garbage near Majestic bus terminal',
        description: 'Garbage has not been collected for 4 days near the primary bus shelter. The bins are overflowing and causing severe foul smell and stray animal menace.',
        location: {
          type: 'Point',
          coordinates: [77.5736, 12.9766],
          address: 'Majestic Bus Stand, Platform 3 Exit, Bengaluru',
          ward: 'Ward 9',
          zone: 'West Zone'
        },
        category: 'Waste Management',
        issueType: 'Commercial Dump Overflow',
        priority: PRIORITY_LEVELS.HIGH,
        priorityScore: 72,
        priorityFactors: { impact: 75, urgency: 70, affectedCitizens: 80, duration: 60 },
        priorityExplanation: 'High priority due to heavy commuter footfall and public hygiene risks at public transit hub.',
        department: deptMap['SAN']._id,
        assignedTeam: teamMap['Solid Waste & Cleanliness Squad']._id,
        assignedOfficer: officerSanitation._id,
        status: COMPLAINT_STATUS.ASSIGNED,
        sla: {
          targetResolutionHours: 36,
          deadline: new Date(now.getTime() + 18 * 60 * 60 * 1000),
          isApproachingDeadline: false,
          isOverdue: false
        },
        aiAnalysis: {
          summary: 'Uncollected garbage overflow near Majestic bus platform causing health and odor nuisance.',
          safetyRisk: 'Medium',
          confidenceScore: 0.91,
          detectedLabels: ['Garbage Dump', 'Overflowing Bin', 'Transit Shelter'],
          isAiAssisted: true,
          analysisType: 'AI-assisted',
          duplicateInfo: { isDuplicate: false, similarityScore: 0 }
        },
        timeline: [
          { status: COMPLAINT_STATUS.SUBMITTED, changedBy: citizen1._id, changedByName: 'Rohan Sharma', changedByRole: 'CITIZEN', timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000), notes: 'Submitted via citizen portal.' },
          { status: COMPLAINT_STATUS.ASSIGNED, changedByName: 'Routing Agent', changedByRole: 'SYSTEM_AGENT', timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000), notes: 'Assigned to Sanitation (Solid Waste & Cleanliness Squad).' }
        ],
        createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000)
      },

      // 4. Streetlight Outage (Resolved - AI Verified)
      {
        complaintId: 'CMP-2026-1004',
        citizen: citizen2._id,
        title: 'Broken streetlight on 5th Cross Residential Lane',
        description: 'Two consecutive streetlights on 5th Cross have stopped functioning, making the whole road dark at night and unsafe for women and children.',
        location: {
          type: 'Point',
          coordinates: [77.5855, 12.9344],
          address: '5th Cross, Jayanagar 4th Block, Bengaluru',
          ward: 'Ward 5',
          zone: 'South Zone'
        },
        category: 'Streetlights',
        issueType: 'Pole Luminaire Failure',
        priority: PRIORITY_LEVELS.MEDIUM,
        priorityScore: 56,
        priorityFactors: { impact: 55, urgency: 60, affectedCitizens: 50, duration: 55 },
        priorityExplanation: 'Medium priority based on night-time visibility and residential safety.',
        department: deptMap['ELEC']._id,
        assignedTeam: teamMap['Streetlight & Power Maintenance Crew']._id,
        assignedOfficer: officerElectrical._id,
        status: COMPLAINT_STATUS.RESOLVED,
        sla: {
          targetResolutionHours: 72,
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
          isApproachingDeadline: false,
          isOverdue: false
        },
        aiAnalysis: {
          summary: 'Two dark streetlights on 5th Cross causing night safety concern.',
          safetyRisk: 'Medium',
          confidenceScore: 0.90,
          detectedLabels: ['Streetlight Outage', 'Dark Road', 'Luminaire Replacement'],
          isAiAssisted: true,
          analysisType: 'AI-assisted',
          duplicateInfo: { isDuplicate: false, similarityScore: 0 }
        },
        resolution: {
          resolutionNotes: 'Inspected pole #JAY-402 and #JAY-403. Replaced faulty 90W LED driver modules and checked junction box wiring. Both luminaires tested and operational.',
          resolvedBy: officerElectrical._id,
          resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          aiVerification: {
            verified: true,
            confidence: 0.94,
            notes: 'Verified against technical replacement logs and luminaire operational checks.'
          },
          citizenExplanation: 'The reported streetlight issue was resolved by the Streetlight & Power Maintenance Crew. The faulty LED drivers on both poles were replaced and nighttime illumination was verified.'
        },
        timeline: [
          { status: COMPLAINT_STATUS.SUBMITTED, changedBy: citizen2._id, changedByName: 'Anita Rao', changedByRole: 'CITIZEN', timestamp: threeDaysAgo, notes: 'Complaint submitted by citizen.' },
          { status: COMPLAINT_STATUS.ASSIGNED, changedByName: 'Routing Agent', changedByRole: 'SYSTEM_AGENT', timestamp: threeDaysAgo, notes: 'Assigned to Electrical Department.' },
          { status: COMPLAINT_STATUS.IN_PROGRESS, changedBy: officerElectrical._id, changedByName: 'Karthik Nair', changedByRole: 'OFFICER', timestamp: twoDaysAgo, notes: 'Field crew scheduled replacement parts.' },
          { status: COMPLAINT_STATUS.RESOLVED, changedBy: officerElectrical._id, changedByName: 'Karthik Nair', changedByRole: 'OFFICER', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), notes: 'Replaced LED drivers. AI verified resolution.', action: 'RESOLUTION_SUBMITTED' }
        ],
        createdAt: threeDaysAgo
      },

      // 5. Water Pipeline Rupture (Reopened)
      {
        complaintId: 'CMP-2026-1005',
        citizen: citizen1._id,
        title: 'Drinking water pipeline leakage and contaminated muddy supply',
        description: 'Main municipal water pipe burst near Block C. Potable water is mixing with drain water and entering residential taps.',
        location: {
          type: 'Point',
          coordinates: [77.6200, 12.9100],
          address: 'Block C, BTM Layout 2nd Stage, Bengaluru',
          ward: 'Ward 8',
          zone: 'South Zone'
        },
        category: 'Water Supply',
        issueType: 'Pipeline Burst & Contamination',
        priority: PRIORITY_LEVELS.HIGH,
        priorityScore: 78,
        priorityFactors: { impact: 85, urgency: 85, affectedCitizens: 75, duration: 40 },
        priorityExplanation: 'High priority due to drinking water potability hazard affecting multiple households.',
        department: deptMap['WATER']._id,
        assignedTeam: teamMap['Pipeline Repair & Supply Ops']._id,
        status: COMPLAINT_STATUS.IN_PROGRESS,
        sla: {
          targetResolutionHours: 24,
          deadline: new Date(now.getTime() + 8 * 60 * 60 * 1000),
          isApproachingDeadline: true,
          isOverdue: false
        },
        aiAnalysis: {
          summary: 'Water pipeline burst causing drinking water contamination in BTM Block C.',
          safetyRisk: 'High',
          confidenceScore: 0.93,
          detectedLabels: ['Water Leakage', 'Contaminated Water', 'Burst Pipe'],
          isAiAssisted: true,
          analysisType: 'AI-assisted',
          duplicateInfo: { isDuplicate: false, similarityScore: 0 }
        },
        reopened: {
          isReopened: true,
          reopenedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          reopenCount: 1,
          reopenReason: 'Temporary patch clamp broke again during high pressure morning supply. Muddy water still coming.',
          reopenedBy: citizen1._id
        },
        timeline: [
          { status: COMPLAINT_STATUS.SUBMITTED, changedBy: citizen1._id, changedByName: 'Rohan Sharma', changedByRole: 'CITIZEN', timestamp: threeDaysAgo, notes: 'Complaint submitted by citizen.' },
          { status: COMPLAINT_STATUS.RESOLVED, changedByName: 'Pipeline Repair Team', changedByRole: 'OFFICER', timestamp: yesterday, notes: 'Patch clamp applied.' },
          { status: COMPLAINT_STATUS.IN_PROGRESS, changedBy: citizen1._id, changedByName: 'Rohan Sharma', changedByRole: 'CITIZEN', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), notes: 'Complaint reopened by citizen: Temporary patch clamp broke again.', action: 'COMPLAINT_REOPENED' }
        ],
        createdAt: threeDaysAgo
      },

      // 6. Duplicate Complaint (Demonstrating Duplicate Intelligence)
      {
        complaintId: 'CMP-2026-1006',
        citizen: citizen2._id,
        title: 'Deep crater on university road causing bike skids',
        description: 'Big pothole right in front of the university gate. Extremely dangerous at night.',
        location: {
          type: 'Point',
          coordinates: [77.5947, 12.9717], // ~15 meters from CMP-2026-1001
          address: 'University Road, Gate 2, Bengaluru',
          ward: 'Ward 12',
          zone: 'Central Zone'
        },
        category: 'Roads & Potholes',
        issueType: 'Road Damage / Pothole',
        priority: PRIORITY_LEVELS.HIGH,
        priorityScore: 78,
        priorityFactors: { impact: 85, urgency: 80, affectedCitizens: 80, duration: 50 },
        priorityExplanation: 'High priority assessment. AI detected potential duplicate of active case CMP-2026-1001.',
        department: deptMap['ROADS']._id,
        assignedTeam: teamMap['Road Maintenance & Pothole Rapid Unit']._id,
        assignedOfficer: officerRoads._id,
        status: COMPLAINT_STATUS.IN_PROGRESS,
        sla: {
          targetResolutionHours: 24,
          deadline: new Date(now.getTime() + 14 * 60 * 60 * 1000)
        },
        aiAnalysis: {
          summary: 'Deep road crater in front of university gate.',
          safetyRisk: 'High',
          confidenceScore: 0.95,
          detectedLabels: ['Pothole', 'University Gate', 'Duplicate Case'],
          isAiAssisted: true,
          analysisType: 'AI-assisted',
          duplicateInfo: {
            isDuplicate: true,
            similarityScore: 0.92,
            relatedComplaintId: 'CMP-2026-1001',
            explanation: 'Potential duplicate because the complaint describes a similar pothole hazard within 18 meters of CMP-2026-1001.'
          }
        },
        timeline: [
          { status: COMPLAINT_STATUS.SUBMITTED, changedBy: citizen2._id, changedByName: 'Anita Rao', changedByRole: 'CITIZEN', timestamp: yesterday, notes: 'Complaint submitted by citizen.' },
          { status: COMPLAINT_STATUS.AI_PROCESSING, changedByName: 'Duplicate Agent', changedByRole: 'SYSTEM_AGENT', timestamp: yesterday, notes: 'AI Duplicate Agent linked to Master Case CMP-2026-1001 (Similarity: 92%).' }
        ],
        createdAt: yesterday
      }
    ];

    const insertedComplaints = await Complaint.insertMany(complaintsData);

    console.log('[Seeder] Seeding Complaint Clusters (Civic Insights)...');
    await ComplaintCluster.create({
      clusterId: 'CLUST-DRAIN-001',
      name: 'Ward 12 Drainage & Inundation Recurrence',
      category: 'Drainage',
      coordinates: [77.5950, 12.9720],
      radiusMeters: 300,
      complaints: [insertedComplaints[1]._id],
      complaintCount: 14,
      severity: 'Critical Chronic',
      ward: 'Ward 12',
      dateRange: { start: fourDaysAgo, end: now },
      affectedCitizensEstimate: 1450,
      status: 'Active Recurring',
      mitigationNotes: 'Chronic drainage vulnerability identified by AI Spatial Engine. Structural desilting tender required before monsoon.'
    });

    await ComplaintCluster.create({
      clusterId: 'CLUST-ROAD-002',
      name: 'University Corridor Pothole Cluster',
      category: 'Roads & Potholes',
      coordinates: [77.5946, 12.9716],
      radiusMeters: 200,
      complaints: [insertedComplaints[0]._id, insertedComplaints[5]._id],
      complaintCount: 8,
      severity: 'High',
      ward: 'Ward 12',
      dateRange: { start: twoDaysAgo, end: now },
      affectedCitizensEstimate: 3200,
      status: 'Active Recurring',
      mitigationNotes: 'Multiple recurring road surface defects near university entrance. Coordinated resurfacing assigned.'
    });

    console.log('[Seeder] Seeding Audit Logs...');
    await AuditLog.create({
      action: 'SYSTEM_INITIALIZED',
      performerName: 'Super Admin Rajesh Patil',
      performerRole: 'SUPER_ADMIN',
      targetResource: 'System',
      targetId: 'SYS-INIT',
      details: { version: '1.0.0', seedRecords: insertedComplaints.length }
    });

    await AuditLog.create({
      action: 'ESCALATION_TRIGGERED',
      performerName: 'Escalation Intelligence Agent',
      performerRole: 'SYSTEM_AGENT',
      targetResource: 'Complaint',
      targetId: 'CMP-2026-1002',
      details: { reason: 'SLA breached by 36h', tier: 'Tier 2' }
    });

    console.log('================================================================');
    console.log('  CIVIC AID SEEDING COMPLETED SUCCESSFULLY!');
    console.log('  Demo Accounts Ready:');
    console.log('    Citizen:     citizen@civicaid.gov       / Citizen@123');
    console.log('    Officer:     officer.roads@civicaid.gov / Officer@123');
    console.log('    Admin:       admin@civicaid.gov         / Admin@123');
    console.log('    Super Admin: superadmin@civicaid.gov    / SuperAdmin@123');
    console.log('================================================================');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]', error);
    process.exit(1);
  }
};

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

seedDatabase();
