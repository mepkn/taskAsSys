import express from 'express';
import { getActivitiesForTask } from '../controllers/activity.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true }); // mergeParams is important to get taskId from parent router

router.use(authenticateUser);

router.route('/').get(getActivitiesForTask);

export default router;
