import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                height: 48,
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)",
              }}
            >
              Login
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
