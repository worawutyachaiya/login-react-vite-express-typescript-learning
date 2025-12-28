import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default GuestRoute;
