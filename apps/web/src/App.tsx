import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" />;
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
