import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

function ForgotPasswordPage() {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5011";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("กรุณากรอกอีเมล");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/forgot-password`, {
        email: email.trim(),
      });

      setSuccess(
        response.data?.message ||
          "หากพบอีเมลในระบบ จะส่งลิงก์รีเซ็ตรหัสผ่านให้",
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          "linear-gradient(135deg, #eff6ff 0%, #f8fafc 45%, #ffffff 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 430,
          borderRadius: "24px",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.12)",
          border: "1px solid #eef2f7",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 30px rgba(37, 99, 235, 0.25)",
                }}
              >
                <LockResetOutlinedIcon sx={{ color: "white", fontSize: 34 }} />
              </Box>
            </Box>

            <Box textAlign="center">
              <Typography variant="h4" fontWeight={700} color="#111827">
                รีเซ็ตรหัสผ่าน
              </Typography>
              <Typography color="#64748b" sx={{ mt: 1, fontSize: 14 }}>
                กรอกอีเมลที่ใช้ในระบบเพื่อรับลิงก์ตั้งรหัสผ่านใหม่
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.2}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    height: 48,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: 16,
                    fontWeight: 600,
                    backgroundColor: "#2563eb",
                    boxShadow: "0 10px 24px rgba(37, 99, 235, 0.25)",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "ส่งลิงก์รีเซ็ตรหัสผ่าน"
                  )}
                </Button>

                <Button
                  component={Link}
                  to="/login"
                  color="inherit"
                  sx={{ textTransform: "none" }}
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ForgotPasswordPage;
