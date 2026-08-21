import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  submitResolution,
  reopenComplaint,
  reassignComplaint
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect); // All complaint routes require authentication

router.route('/')
  .post(upload.array('images', 5), createComplaint)
  .get(getComplaints);

router.route('/:id')
  .get(getComplaintById)
  .patch(authorize(ROLES.OFFICER, ROLES.ADMIN, ROLES.SUPER_ADMIN), updateComplaintStatus);

router.post('/:id/resolution', authorize(ROLES.OFFICER, ROLES.ADMIN, ROLES.SUPER_ADMIN), upload.array('afterImages', 3), submitResolution);
router.post('/:id/reopen', reopenComplaint);
router.post('/:id/reassign', authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), reassignComplaint);

export default router;
