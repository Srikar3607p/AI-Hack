/**
 * backend/src/utils/asyncHandler.js
 * Wraps async route handlers to avoid try/catch boilerplate.
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }));
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
