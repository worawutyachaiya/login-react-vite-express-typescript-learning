import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        minWidth: "100vw",
        background: "#f8fafc",
      }}
    >
      <AppBar position="static" sx={{ background: "#1e293b" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            Welcome back, <strong>{user?.username}</strong>!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You have successfully authenticated and accessed this protected
            route.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
