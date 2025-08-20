import { Request, Response } from "express";

export const getUsers = (req: Request, res: Response) => {
  res.status(200).json({ message: "Get all users" });
};

export const createUser = (req: Request, res: Response) => {
  const { name } = req.body;
  res.status(201).json({ message: `User ${name} created successfully` });
};
