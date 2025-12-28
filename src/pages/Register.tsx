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
import { useRegisterMutation } from "../hooks/useAuthMutation";

const Register = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    registerMutation.mutate(
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          navigate("/login");
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || "Registration failed");
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
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
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
            Create Account
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Join us to start your journey
          </Typography>

          {(error || registerMutation.isError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || "Registration failed"}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              fullWidth
              margin="normal"
              required
              value={formData.username}
              onChange={handleChange}
              disabled={registerMutation.isPending}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={registerMutation.isPending}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={registerMutation.isPending}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              margin="normal"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={registerMutation.isPending}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={registerMutation.isPending}
              sx={{
                mt: 3,
                mb: 2,
                height: 48,
                fontSize: "1rem",
                fontWeight: 600,
                background: "linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)",
              }}
            >
              {registerMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>

            <Box textAlign="center">
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#2563eb" }}
              >
                Already have an account? Login
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
