import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  type!: TransactionType;

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "varchar", nullable: true })
  originAccountId!: string | null;

  @Column({ type: "varchar", nullable: true })
  destinationAccountId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
