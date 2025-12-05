import { Response } from "express";

import { AuthRequest } from "../middlewares/auth";
import { AppError, asyncHandler } from "../middlewares/errorHandler";
import { accountService } from "../services/accountService";

const getBalance = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const accountId = req.query.account_id as string;

  if (!accountId) {
    throw new AppError("Account ID is required", 400);
  }

  const balance = await accountService.getBalance(accountId);

  if (balance === null) {
    throw new AppError("Account not found", 404);
  }

  res.status(200).json({ balance });
});

const handleEvent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { type, origin, destination, amount } = req.body;

  if (!type || !amount || amount <= 0) {
    throw new AppError("Type and valid amount are required", 400);
  }

  switch (type) {
    case "deposit": {
      if (!destination) {
        throw new AppError("Destination is required for deposit", 400);
      }

      const account = await accountService.deposit(destination, amount);

      res.status(201).json({
        destination: {
          id: account.accountId,
          balance: Number(account.balance),
        },
      });
      break;
    }

    case "withdraw": {
      if (!origin) {
        throw new AppError("Origin is required for withdraw", 400);
      }

      const account = await accountService.withdraw(origin, amount);

      res.status(201).json({
        origin: {
          id: account.accountId,
          balance: Number(account.balance),
        },
      });
      break;
    }

    case "transfer": {
      if (!origin || !destination) {
        throw new AppError("Origin and destination are required for transfer", 400);
      }

      const result = await accountService.transfer(origin, destination, amount);

      res.status(201).json({
        origin: {
          id: result.origin.accountId,
          balance: Number(result.origin.balance),
        },
        destination: {
          id: result.destination.accountId,
          balance: Number(result.destination.balance),
        },
      });
      break;
    }

    default:
      throw new AppError("Invalid event type", 400);
  }
});

const reset = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  await accountService.reset();

  res.status(200).json({ message: "OK" });
});

export const accountController = {
  getBalance,
  handleEvent,
  reset,
};
