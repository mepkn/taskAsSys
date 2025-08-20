import express from "express";
import {
  getAllTasksForEmployee,
  updateTaskStatus,
} from "../controllers/task.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { isEmployee } from "../middleware/role.middleware";

const router = express.Router();

// All routes in this file are protected and restricted to Employees
router.use(authenticateUser, isEmployee);

router.get("/tasks", getAllTasksForEmployee);
router.patch("/tasks/:id/status", updateTaskStatus);

export default router;
