import { Request, Response } from "express";

import { AppError, asyncHandler } from "../middlewares/errorHandler";
import { authService } from "../services/authService";

const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new AppError("Username and password are required", 400);
  }

  const token = await authService.login(username, password);

  res.status(200).json({ token });
});

export const authController = {
  login,
};
