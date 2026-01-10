import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Layouts & Guards
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages - Auth
import LoginPage from "./pages/LoginPage";

// Pages - Main Dashboard
import DashboardPage from "./pages/DashboardPage";
import LeaderboardPage from "./pages/LeaderboardPage";

// Pages - Devices & Maintenance
import DevicesPage from "./pages/DevicesPage";
import DeviceEditPage from "./pages/DeviceEditPage";
import MaintenancePage from "./pages/MaintenancePage";

// Pages - Files
import FilesPage from "./pages/FilesPage";
import FileUploadPage from "./pages/FileUploadPage";

// Pages - Settings (Users, Roles, Mail, About)
import UsersPage from "./pages/UsersPage";
import UserCreatePage from "./pages/UserCreatePage";
import UserEditPage from "./pages/UserEditPage";
import RolesPage from "./pages/RolesPage";
import RoleEditPage from "./pages/RoleEditPage";     
import MailsPage from "./pages/MailsPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC ROUTES (Login) --- */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* --- PROTECTED ROUTES (Cần đăng nhập) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            
            {/* 1. Dashboard & Gamification */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />

            {/* 2. Devices Module */}
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/devices/new" element={<DeviceEditPage />} />
            <Route path="/devices/:id" element={<DeviceEditPage />} />
            
            <Route path="/maintenance" element={<MaintenancePage />} />

            {/* 3. Settings Module */}
            {/* Users */}
            <Route path="/settings/users" element={<UsersPage />} />
            <Route path="/settings/users/new" element={<UserCreatePage />} />
            <Route path="/settings/users/:id" element={<UserEditPage />} />

            {/* Roles */}
            <Route path="/settings/roles" element={<RolesPage />} />
            <Route path="/settings/roles/new" element={<RoleEditPage />} />
            <Route path="/settings/roles/:id" element={<RoleEditPage />} />

            {/* Files & Media */}
            <Route path="/settings/files" element={<FilesPage />} />
            <Route path="/settings/files/new" element={<FileUploadPage />} />
            {/* Mail */}
            <Route path="/settings/mails" element={<MailsPage />} />

            {/* Other */}
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Route>

        {/* Catch all - Redirect về login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
      
      {/* Toast Notification Global */}
      <Toaster richColors position="top-right" closeButton />
    </BrowserRouter>
  );
}

export default App;