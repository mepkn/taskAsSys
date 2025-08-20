import { Request, Response, NextFunction } from "express";

export const isSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "SuperAdmin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Access is restricted to Super Admins" });
  }
  next();
};

export const isEmployer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "Employer") {
    return res
      .status(403)
      .json({ message: "Forbidden: Access is restricted to Employers" });
  }
  next();
};

export const isEmployee = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "Employee") {
    return res
      .status(403)
      .json({ message: "Forbidden: Access is restricted to Employees" });
  }
  next();
};

// Middleware to allow Employers or SuperAdmins
export const isEmployerOrSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "Employer" && req.user?.role !== "SuperAdmin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Access is restricted" });
  }
  next();
};
