export interface Account {
  id: string;
  balance: number;
}

export interface EventRequest {
  type: "deposit" | "withdraw" | "transfer";
  origin?: string;
  destination?: string;
  amount: number;
}

export interface EventResponse {
  origin?: Account;
  destination?: Account;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface BalanceResponse {
  balance: number;
}

export interface ApiError {
  error: string;
}
