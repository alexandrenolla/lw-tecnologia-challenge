import { Router } from "express";

import { authController } from "../controllers/authController";

const router = Router();

// Public routes
router.post("/login", authController.login);

// Protected routes (to be implemented)
// router.get("/balance", requireAuth, accountController.getBalance);
// router.post("/event", requireAuth, accountController.handleEvent);
// router.post("/reset", requireAuth, accountController.reset);

export default router;
