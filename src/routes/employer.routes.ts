import express from "express";
import { createEmployee, getTaskReport } from "../controllers/employer.controller";
import {
  createTask,
  getAllTasksForEmployer,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { isEmployer } from "../middleware/role.middleware";

const router = express.Router();

// All routes in this file are protected and restricted to Employers
router.use(authenticateUser, isEmployer);

// Employee management
router.post("/employees", createEmployee);

// Task management
router.post("/tasks", createTask);
router.get("/tasks", getAllTasksForEmployer);
router.route("/tasks/:id").get(getTask).patch(updateTask).delete(deleteTask);

// Reporting
router.get("/reports/tasks", getTaskReport);

export default router;
