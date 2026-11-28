import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router';

import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

// Todas as rotas estão abertas nesta entrega (RN03; ADR-001).
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />
        <Route
          path="/unauthorized"
          element={<UnauthorizedPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
