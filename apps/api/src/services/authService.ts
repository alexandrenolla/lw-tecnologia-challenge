import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../config/database";
import { env } from "../config/env";
import { User } from "../entities/User";
import { AppError } from "../middlewares/errorHandler";
import { JwtPayload } from "../types/auth.types";

const userRepository = AppDataSource.getRepository(User);

async function login(username: string, password: string): Promise<string> {
  const user = await userRepository.findOne({ where: { username } });

  if (!user) {
    throw new AppError("Invalid credentials", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 403);
  }

  const payload: JwtPayload = {
    userId: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });

  return token;
}

async function seedDefaultUser(): Promise<void> {
  const existingUser = await userRepository.findOne({ where: { username: "admin" } });

  if (existingUser) {
    return;
  }

  const hashedPassword = await bcrypt.hash("admin", 10);

  const user = userRepository.create({
    username: "admin",
    password: hashedPassword,
  });

  await userRepository.save(user);

  console.log("Default user created: admin/admin");
}

export const authService = {
  login,
  seedDefaultUser,
};
