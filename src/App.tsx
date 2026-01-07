import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Import các trang
import DashboardPage from "./pages/DashboardPage"; 
import UsersPage from "./pages/UsersPage";      
import DevicesPage from "./pages/DevicesPage";
import MaintenancePage from "./pages/MaintenancePage";
import RolesPage from "./pages/RolesPage";
import PermissionsPage from "./pages/PermissionsPage";
import UserEditPage from "./pages/UserEditPage";
import UserCreatePage from "./pages/UserCreatePage";
import RoleEditPage from "./pages/RoleEditPage";
import FilesPage from "./pages/FilesPage";
import FileUploadPage from "./pages/FileUploadPage";
import MailsPage from "./pages/MailsPage";
import DeviceEditPage from "./pages/DeviceEditPage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} /> 
            
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/devices/new" element={<DeviceEditPage />} />
            <Route path="/devices/:id" element={<DeviceEditPage />} /> 
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Nhóm Settings */}
            <Route path="/settings/users" element={<UsersPage />} />
            <Route path="/settings/users/new" element={<UserCreatePage />} />
            <Route path="/settings/users/:id" element={<UserEditPage />} />
            <Route path="/settings/roles" element={<RolesPage />} />
            <Route path="/settings/roles/new" element={<RoleEditPage />} /> 
            <Route path="/settings/roles/:id" element={<RoleEditPage />} /> 
            <Route path="/settings/permissions" element={<PermissionsPage />} />
            <Route path="/settings/files" element={<FilesPage />} />
            <Route path="/settings/files/new" element={<FileUploadPage />} />
            <Route path="/settings/mails" element={<MailsPage />} />

          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
      
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;