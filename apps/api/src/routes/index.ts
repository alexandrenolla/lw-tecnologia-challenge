import { Router } from "express";

import { accountController } from "../controllers/accountController";
import { authController } from "../controllers/authController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Public routes
router.post("/login", authController.login);

// Protected routes
router.get("/balance", requireAuth, accountController.getBalance);
router.post("/event", requireAuth, accountController.handleEvent);
router.post("/reset", requireAuth, accountController.reset);

export default router;
