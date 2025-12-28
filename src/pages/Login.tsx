import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useLoginMutation } from "../hooks/useAuthMutation";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginMutation = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      {
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          login(data.token, data.user);
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#334155" }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Sign in to continue
          </Typography>

          {loginMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {(loginMutation.error as any)?.response?.data?.message ||
                "Login failed"}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loginMutation.isPending}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={loginMutation.isPending}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loginMutation.isPending}
              sx={{
                mt: 3,
                mb: 2,
                height: 48,
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)",
              }}
            >
              {loginMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>

            <Box textAlign="center">
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "#2563eb" }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
