import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

// Import các trang nội dung
import { ListOfUsers } from "./components/ListOfUsers"; 
import DevicesPage from "./pages/DevicesPage";
import MaintenancePage from "./pages/MaintenancePage";

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
            <Route path="/" element={<ListOfUsers />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/about" element={<div className="p-4">About Page Content</div>} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
      
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}

export default App;