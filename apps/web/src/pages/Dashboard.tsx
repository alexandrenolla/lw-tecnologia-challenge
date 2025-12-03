import { FormEvent, useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { BalanceResponse, EventRequest, EventResponse } from "../types/types";
import "./Dashboard.css";

export function Dashboard() {
  const [accountId, setAccountId] = useState("100");
  const [balance, setBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    if (accountId) {
      loadBalance();
    }
  }, [accountId]);

  async function loadBalance(): Promise<void> {
    try {
      const response = await api.get<BalanceResponse>(`/balance?account_id=${accountId}`);
      setBalance(response.data.balance);
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          setBalance(null);
        }
      }
    }
  }

  async function handleOperation(type: "deposit" | "withdraw" | "transfer"): Promise<void> {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const event: EventRequest = {
        type,
        amount: Number(amount),
      };

      if (type === "deposit") {
        event.destination = accountId;
      } else if (type === "withdraw") {
        event.origin = accountId;
      } else if (type === "transfer") {
        event.origin = accountId;
        event.destination = destinationId;
      }

      await api.post<EventResponse>("/event", event);

      setMessage(
        type === "deposit"
          ? "Depósito realizado com sucesso!"
          : type === "withdraw"
            ? "Saque realizado com sucesso!"
            : "Transferência realizada com sucesso!",
      );

      setAmount("");
      setDestinationId("");
      await loadBalance();
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(axiosError.response?.data?.error || "Erro ao realizar operação");
      } else {
        setError("Erro ao realizar operação");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDeposit(e: FormEvent): void {
    e.preventDefault();
    handleOperation("deposit");
  }

  function handleWithdraw(e: FormEvent): void {
    e.preventDefault();
    handleOperation("withdraw");
  }

  function handleTransfer(e: FormEvent): void {
    e.preventDefault();
    handleOperation("transfer");
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard Bancário</h1>
        <button onClick={logout} className="logout-button">
          Sair
        </button>
      </header>

      <div className="dashboard-content">
        <section className="balance-section">
          <h2>Consultar Saldo</h2>
          <div className="balance-form">
            <label htmlFor="accountId">Conta:</label>
            <input
              id="accountId"
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="Ex: 100"
            />
          </div>
          <div className="balance-display">
            {balance !== null ? (
              <p>
                Saldo: <strong>R$ {balance.toFixed(2)}</strong>
              </p>
            ) : (
              <p className="account-not-found">Conta não existe</p>
            )}
          </div>
        </section>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="operations-grid">
          <div className="operation-card">
            <h3>Depósito</h3>
            <form onSubmit={handleDeposit}>
              <div className="form-group">
                <label htmlFor="deposit-amount">Valor:</label>
                <input
                  id="deposit-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading || !amount || !accountId}>
                {loading ? "Processando..." : "Depositar"}
              </button>
            </form>
          </div>

          <div className="operation-card">
            <h3>Saque</h3>
            <form onSubmit={handleWithdraw}>
              <div className="form-group">
                <label htmlFor="withdraw-amount">Valor:</label>
                <input
                  id="withdraw-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading || !amount || !accountId}>
                {loading ? "Processando..." : "Sacar"}
              </button>
            </form>
          </div>

          <div className="operation-card">
            <h3>Transferência</h3>
            <form onSubmit={handleTransfer}>
              <div className="form-group">
                <label htmlFor="destination-id">Conta Destino:</label>
                <input
                  id="destination-id"
                  type="text"
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  placeholder="Ex: 300"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="transfer-amount">Valor:</label>
                <input
                  id="transfer-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !amount || !destinationId || !accountId}
              >
                {loading ? "Processando..." : "Transferir"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
