import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import TurfDetails from "./pages/TurfDetails";

import UserLayout from "./layouts/UserLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import AdminLayout from "./layouts/AdminLayout";

import UserDashboard from "./pages/user/UserDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import NotFound from "./pages/NotFound";
import PrivateRoute from "./routes/PrivateRoute";
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/turfs/:turfId" element={<TurfDetails />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <PrivateRoute allowedRole="USER">
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>

        {/* Manager Routes */}
        <Route
          path="/manager/*"
          element={
            <PrivateRoute allowedRole="MANAGER">
              <ManagerLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<ManagerDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRole="ADMIN">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
