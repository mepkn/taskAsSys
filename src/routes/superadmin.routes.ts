import express from "express";
import { createEmployer } from "../controllers/superadmin.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { isSuperAdmin } from "../middleware/role.middleware";

const router = express.Router();

// All routes in this file are protected and restricted to Super Admins
router.use(authenticateUser, isSuperAdmin);

router.post("/employers", createEmployer);

export default router;
