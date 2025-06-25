import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Button, TextField, Link, Typography, Alert } from "@mui/material";
import { useStore } from "@/store";
import { ApiService } from "@/services/api";
export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await ApiService.login(email, password);
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  return _jsxs(Box, {
    component: "form",
    sx: { width: "100%" },
    onSubmit: handleSubmit,
    children: [
      error &&
        _jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }),
      _jsx(TextField, {
        autoFocus: true,
        fullWidth: true,
        required: true,
        autoComplete: "email",
        id: "email",
        label: "Email Address",
        margin: "normal",
        name: "email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
      }),
      _jsx(TextField, {
        fullWidth: true,
        required: true,
        autoComplete: "current-password",
        id: "password",
        label: "Password",
        margin: "normal",
        name: "password",
        type: "password",
        value: password,
        onChange: (e) => setPassword(e.target.value),
      }),
      _jsx(Button, {
        fullWidth: true,
        disabled: isLoading,
        sx: { mt: 3, mb: 2 },
        type: "submit",
        variant: "contained",
        children: isLoading ? "Signing in..." : "Sign In",
      }),
      _jsxs(Box, {
        sx: { textAlign: "center" },
        children: [
          _jsxs(Typography, {
            sx: { mb: 1 },
            variant: "body2",
            children: [
              "Don't have an account?",
              " ",
              _jsx(Link, {
                component: RouterLink,
                to: "/register",
                variant: "body2",
                children: "Sign up",
              }),
            ],
          }),
          _jsx(Link, {
            component: RouterLink,
            to: "/forgot-password",
            variant: "body2",
            children: "Forgot password?",
          }),
        ],
      }),
    ],
  });
}
