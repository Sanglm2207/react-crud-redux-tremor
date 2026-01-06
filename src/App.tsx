import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import CreateNewUser from "./components/CreateNewUser";
import { ListOfUsers } from "./components/ListOfUsers";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import { Button } from "@tremor/react";
import { logout } from "./store/auth/reducers";
import { useAppDispatch } from "./store/store";

// Tách Dashboard thành component riêng để code App gọn
const Dashboard = () => {
    const dispatch = useAppDispatch();
    return (
        <div className="max-w-screen-xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button color="red" onClick={() => dispatch(logout())}>Logout</Button>
            </div>
            <ListOfUsers />
            <CreateNewUser />
        </div>
    );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes (Login) */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes (Dashboard) */}
        <Route element={<ProtectedRoute />}>
           {/* Nếu vào trang chủ "/" sẽ render Dashboard */}
          <Route path="/" element={<Dashboard />} />
        </Route>

        {/* Catch all - Redirect to login */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
      
      <Toaster richColors />
    </BrowserRouter>
  );
}

export default App;