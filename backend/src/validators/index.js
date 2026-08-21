/**
 * backend/src/validators/index.js
 * Request validation schemas for authentication and complaint inputs.
 */

export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }
  next();
};

export const validateComplaint = (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }
  next();
};
