import express from "express";
import {
  createComment,
  getCommentsForTask,
} from "../controllers/comment.controller";
import { uploadFile } from "../controllers/file.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const router = express.Router();

// All routes in this file are protected
router.use(authenticateUser);

// Comment routes
router
  .route("/:taskId/comments")
  .post(createComment)
  .get(getCommentsForTask);

// File upload route
router.route("/:taskId/files").post(upload, uploadFile);

export default router;
