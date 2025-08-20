import { Request, Response, NextFunction } from "express";
import { isTokenValid } from "../utils/jwt";

// Extend the Express Request interface to include the user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication Invalid: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = isTokenValid(token) as { userId: string; role: string };
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication Invalid: Token is not valid" });
  }
};
