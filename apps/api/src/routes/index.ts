import { Router } from "express";

import { accountController } from "../controllers/accountController";
import { authController } from "../controllers/authController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       403:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /balance:
 *   get:
 *     summary: Get account balance
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: account_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "100"
 *     responses:
 *       200:
 *         description: Balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   example: 20
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Account not found
 *       401:
 *         description: Unauthorized
 */
router.get("/balance", requireAuth, accountController.getBalance);

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Execute banking operation
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required:
 *                   - type
 *                   - destination
 *                   - amount
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [deposit]
 *                   destination:
 *                     type: string
 *                     example: "100"
 *                   amount:
 *                     type: number
 *                     example: 10
 *               - type: object
 *                 required:
 *                   - type
 *                   - origin
 *                   - amount
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [withdraw]
 *                   origin:
 *                     type: string
 *                     example: "100"
 *                   amount:
 *                     type: number
 *                     example: 5
 *               - type: object
 *                 required:
 *                   - type
 *                   - origin
 *                   - destination
 *                   - amount
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [transfer]
 *                   origin:
 *                     type: string
 *                     example: "100"
 *                   destination:
 *                     type: string
 *                     example: "300"
 *                   amount:
 *                     type: number
 *                     example: 15
 *     responses:
 *       201:
 *         description: Operation successful
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     destination:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "100"
 *                         balance:
 *                           type: number
 *                           example: 10
 *                 - type: object
 *                   properties:
 *                     origin:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "100"
 *                         balance:
 *                           type: number
 *                           example: 5
 *                 - type: object
 *                   properties:
 *                     origin:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "100"
 *                         balance:
 *                           type: number
 *                           example: 0
 *                     destination:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "300"
 *                         balance:
 *                           type: number
 *                           example: 15
 *       400:
 *         description: Invalid request or insufficient funds
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 */
router.post("/event", requireAuth, accountController.handleEvent);

/**
 * @swagger
 * /reset:
 *   post:
 *     summary: Reset all accounts and transactions
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OK
 *       401:
 *         description: Unauthorized
 */
router.post("/reset", requireAuth, accountController.reset);

export default router;
