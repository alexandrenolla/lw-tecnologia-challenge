import "reflect-metadata";
import { DataSource } from "typeorm";

import { env } from "./env";
import { Account } from "../entities/Account";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: env.DATABASE_URL,
  synchronize: true,
  logging: env.NODE_ENV === "development",
  entities: [Account, Transaction, User],
});
