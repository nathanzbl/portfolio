import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/layout/AdminLayout';

import { HomePage } from './pages/public/HomePage';
import { GameJoinPage } from './pages/public/GameJoinPage';
import { GameLobbyPage } from './pages/public/GameLobbyPage';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProjectsPage } from './pages/admin/ProjectsPage';
import { ExperiencePage } from './pages/admin/ExperiencePage';
import { SkillsPage } from './pages/admin/SkillsPage';
import { GamesPage } from './pages/admin/GamesPage';
import { UsersPage } from './pages/admin/UsersPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<GameJoinPage />} />
          <Route path="/game/:roomCode" element={<GameLobbyPage />} />

          {/* Admin auth */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="games" element={<GamesPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
