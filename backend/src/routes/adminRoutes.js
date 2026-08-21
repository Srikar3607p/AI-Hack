import express from 'express';
import {
  getAnalytics,
  getCivicInsights,
  getEscalations,
  getDepartments,
  createOrUpdateDepartment,
  getTeams,
  createTeam,
  getUsers,
  updateUserRoleStatus,
  getAuditLogs,
  getSystemHealth
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN));

router.get('/analytics', getAnalytics);
router.get('/insights', getCivicInsights);
router.get('/escalations', getEscalations);
router.get('/health', getSystemHealth);

router.route('/departments')
  .get(getDepartments)
  .post(createOrUpdateDepartment);

router.route('/teams')
  .get(getTeams)
  .post(createTeam);

router.get('/users', getUsers);
router.patch('/users/:id/role', authorize(ROLES.SUPER_ADMIN), updateUserRoleStatus);
router.get('/audit-logs', authorize(ROLES.SUPER_ADMIN), getAuditLogs);

export default router;
