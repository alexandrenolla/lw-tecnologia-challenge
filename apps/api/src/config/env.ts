import dotenv from "dotenv";

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  TYPEORM_USERNAME: process.env.TYPEORM_USERNAME!,
  TYPEORM_PASSWORD: process.env.TYPEORM_PASSWORD!,
  TYPEORM_DATABASE: process.env.TYPEORM_DATABASE!,
};
