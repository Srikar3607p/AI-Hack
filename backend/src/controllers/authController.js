import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { Team } from '../models/Team.js';
import { ROLES } from '../config/constants.js';
import { logAuditEvent } from '../services/auditService.js';

// In-memory OTP store for demo/hackathon (mapped by phone)
const otpStore = new Map();

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'civic_aid_super_secret_jwt_key_2026_hackathon';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id, role }, secret, { expiresIn });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role = ROLES.CITIZEN, departmentId, teamId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const userData = {
      name,
      email,
      password,
      phone: phone || '',
      role: [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role) ? ROLES.CITIZEN : role // Prevent unauthorized direct admin registration
    };

    if (role === ROLES.OFFICER && departmentId) {
      userData.department = departmentId;
      userData.team = teamId || null;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id, user.role);

    await logAuditEvent({
      action: 'USER_REGISTERED',
      user,
      targetResource: 'User',
      targetId: user._id,
      details: { email: user.email, role: user.role }
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        department: user.department,
        team: user.team
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email }).select('+password').populate('department team');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User does not exist.'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated by civic administration.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id, user.role);

    await logAuditEvent({
      action: 'USER_LOGIN',
      user,
      targetResource: 'User',
      targetId: user._id,
      details: { role: user.role }
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        department: user.department,
        team: user.team
      }
    });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    // Generate 6-digit OTP (Default 123456 in dev/demo)
    const otp = process.env.NODE_ENV === 'production' ? Math.floor(100000 + Math.random() * 900000).toString() : '123456';
    otpStore.set(phone, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${phone}. (Demo code: ${otp})`,
      demoOtp: otp
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    const record = otpStore.get(phone);

    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new code.'
      });
    }

    otpStore.delete(phone);

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { isPhoneVerified: true, phone });
    }

    res.status(200).json({
      success: true,
      message: 'Phone number successfully verified!'
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('department team');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { ...(name && { name }), ...(phone && { phone }) },
      { new: true, runValidators: true }
    ).populate('department team');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated
    });
  } catch (error) {
    next(error);
  }
};
