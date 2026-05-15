import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import { useForm } from "react-hook-form";

import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  Stack,
  InputAdornment,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const response = await axios.post("http://localhost:5011/login", {
        email: data.email,
        password: data.password,
      });

      const user = response.data.user;

      if (user.status !== "active") {
        return alert("คุณไม่มีสิทธิ์เข้าใช้งาน");
      }

      const userData = {
        role_id: user.role_id,
        token: response.data.token,
        first_name: user.first_name,
        last_name: user.last_name,
        user_id: user.id,
        department_id: user.department_id,
        status: user.status,
      };

      dispatch(login(userData));
      localStorage.setItem("user", JSON.stringify(userData));

      roleRedirects(user.role_id);
    } catch (error) {
      console.error("There was an error logging in!", error);
      alert("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบ Email และ Password");
    }
  };

  const roleRedirects = (role) => {
    if (role === 1) {
      navigate("/admin/index");
    } else if (role === 2) {
      navigate("/manager/index");
    } else if (role === 3) {
      navigate("/technician/index");
    } else {
      navigate("/user");
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
        <CardContent
          sx={{
            p: {
              xs: 3,
              sm: 5,
            },
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              borderRadius: "18px",
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(37, 99, 235, 0.25)",
            }}
          >
            <HeadsetMicOutlinedIcon sx={{ color: "white", fontSize: 34 }} />
          </Box>

          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.6px",
            }}
          >
            Helpdesk
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "#64748b",
              mt: 1,
              mb: 4,
              fontSize: "14px",
            }}
          >
            เข้าสู่ระบบเพื่อจัดการงานแจ้งซ่อม
          </Typography>

          <form onSubmit={handleSubmit(handleLogin)}>
            <Stack spacing={2.2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register("email", {
                  required: "กรุณากรอก Email",
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register("password", {
                  required: "กรุณากรอก Password",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  height: 48,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  backgroundColor: "#2563eb",
                  boxShadow: "0 10px 24px rgba(37, 99, 235, 0.25)",

                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.32)",
                  },
                }}
              >
                Login
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginPage;
