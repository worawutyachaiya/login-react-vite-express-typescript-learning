import { Routes, Route, Navigate } from "react-router";
import { Suspense, lazy } from "react";
import { CircularProgress, Box } from "@mui/material";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import VerticalLayout from "./layouts/VerticalLayout";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EmployeeList = lazy(() => import("./pages/employees/EmployeeList"));
const EmployeeForm = lazy(() => import("./pages/employees/EmployeeForm"));
const Departments = lazy(() => import("./pages/departments/Departments"));
const Positions = lazy(() => import("./pages/positions/Positions"));
const Settings = lazy(() => import("./pages/settings/Settings"));

const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<VerticalLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/new" element={<EmployeeForm />} />
            <Route path="/employees/:id/edit" element={<EmployeeForm />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
