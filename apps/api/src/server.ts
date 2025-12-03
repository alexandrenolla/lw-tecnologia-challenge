import "reflect-metadata";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { AppDataSource } from "./config/database";
import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes";
import { authService } from "./services/authService";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes);

app.use(errorHandler);

async function startServer(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    await authService.seedDefaultUser();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`Swagger docs available at http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
