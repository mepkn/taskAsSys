import express from "express";
import { login } from "../controllers/auth.controller";
import { forgotPassword, resetPassword } from "../controllers/password.controller";

const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
