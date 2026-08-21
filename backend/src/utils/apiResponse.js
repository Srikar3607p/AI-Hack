/**
 * backend/src/utils/apiResponse.js
 * Standardised API response helpers.
 * All controllers should use these rather than res.json() directly.
 */

export const sendSuccess = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, ...data });
};

export const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};
