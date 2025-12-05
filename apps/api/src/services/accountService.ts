import { AppDataSource } from "../config/database";
import { Account } from "../entities/Account";
import { Transaction, TransactionType } from "../entities/Transaction";
import { AppError } from "../middlewares/errorHandler";

const accountRepository = AppDataSource.getRepository(Account);
const transactionRepository = AppDataSource.getRepository(Transaction);

async function getBalance(accountId: string): Promise<number | null> {
  const account = await accountRepository.findOne({ where: { accountId } });

  if (!account) {
    return null;
  }

  return Number(account.balance);
}

async function deposit(accountId: string, amount: number): Promise<Account> {
  let account = await accountRepository.findOne({ where: { accountId } });

  if (!account) {
    account = accountRepository.create({
      accountId,
      balance: amount,
    });
  } else {
    account.balance = Number(account.balance) + amount;
  }

  await accountRepository.save(account);

  const transaction = transactionRepository.create({
    type: TransactionType.DEPOSIT,
    amount,
    destinationAccountId: accountId,
    originAccountId: null,
  });

  await transactionRepository.save(transaction);

  return account;
}

async function withdraw(accountId: string, amount: number): Promise<Account> {
  const account = await accountRepository.findOne({ where: { accountId } });

  if (!account) {
    throw new AppError("Account not found", 404);
  }

  const currentBalance = Number(account.balance);

  if (currentBalance < amount) {
    throw new AppError("Insufficient funds", 400);
  }

  account.balance = currentBalance - amount;

  await accountRepository.save(account);

  const transaction = transactionRepository.create({
    type: TransactionType.WITHDRAW,
    amount,
    originAccountId: accountId,
    destinationAccountId: null,
  });

  await transactionRepository.save(transaction);

  return account;
}

async function transfer(
  originId: string,
  destinationId: string,
  amount: number,
): Promise<{ origin: Account; destination: Account }> {
  const origin = await accountRepository.findOne({ where: { accountId: originId } });

  if (!origin) {
    throw new AppError("Account not found", 404);
  }

  const originBalance = Number(origin.balance);

  if (originBalance < amount) {
    throw new AppError("Insufficient funds", 400);
  }

  let destination = await accountRepository.findOne({ where: { accountId: destinationId } });

  if (!destination) {
    destination = accountRepository.create({
      accountId: destinationId,
      balance: 0,
    });
  }

  origin.balance = originBalance - amount;
  destination.balance = Number(destination.balance) + amount;

  await accountRepository.save(origin);
  await accountRepository.save(destination);

  const transaction = transactionRepository.create({
    type: TransactionType.TRANSFER,
    amount,
    originAccountId: originId,
    destinationAccountId: destinationId,
  });

  await transactionRepository.save(transaction);

  return { origin, destination };
}

async function reset(): Promise<void> {
  await transactionRepository.clear();
  await accountRepository.clear();
}

export const accountService = {
  getBalance,
  deposit,
  withdraw,
  transfer,
  reset,
};
