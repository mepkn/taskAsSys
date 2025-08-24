import express from "express";
import {
  createComment,
  getCommentsForTask,
} from "../controllers/comment.controller";
import { uploadFile } from "../controllers/file.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import activityRoutes from "./activity.routes";

const router = express.Router();

// All routes in this file are protected
router.use(authenticateUser);

// Activity routes
router.use("/:taskId/activities", activityRoutes);

// Comment routes
router
  .route("/:taskId/comments")
  .post(createComment)
  .get(getCommentsForTask);

// File upload route
router.route("/:taskId/files").post(upload, uploadFile);

export default router;
