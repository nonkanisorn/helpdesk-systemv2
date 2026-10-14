import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const pageContent = {
  invite: {
    icon: <PersonAddAltOutlinedIcon fontSize="medium" />,
    iconBg: "#e0f2fe",
    iconColor: "#0369a1",
    title: "ตั้งรหัสผ่านครั้งแรก",
    subtitle:
      "สร้างรหัสผ่านสำหรับเปิดใช้งานบัญชี Helpdesk ของคุณ หลังจากตั้งค่าเสร็จสามารถเข้าสู่ระบบได้ทันที",
    passwordLabel: "รหัสผ่านสำหรับเข้าใช้งาน",
    passwordPlaceholder: "ตั้งรหัสผ่านของคุณ",
    confirmLabel: "ยืนยันรหัสผ่าน",
    confirmPlaceholder: "กรอกรหัสผ่านอีกครั้ง",
    submitText: "เปิดใช้งานบัญชี",
    successText: "ตั้งรหัสผ่านสำเร็จ บัญชีของคุณพร้อมใช้งานแล้ว",
    helperTitle: "ตั้งรหัสผ่านที่ปลอดภัย",
    helperText:
      "ควรมีอย่างน้อย 8 ตัวอักษร และใช้รหัสผ่านที่ไม่ซ้ำกับบริการอื่น เพื่อปกป้องบัญชีของคุณ",
    linkNote: "ลิงก์เชิญนี้ใช้ได้ครั้งเดียวและมีเวลาจำกัด",
  },
  reset: {
    icon: <RestartAltOutlinedIcon fontSize="medium" />,
    iconBg: "#e8f0fe",
    iconColor: "#2563eb",
    title: "ตั้งรหัสผ่านใหม่",
    subtitle:
      "กรุณากำหนดรหัสผ่านใหม่สำหรับบัญชี Helpdesk ของคุณ แล้วเข้าสู่ระบบอีกครั้งด้วยรหัสผ่านล่าสุด",
    passwordLabel: "รหัสผ่านใหม่",
    passwordPlaceholder: "กรอกรหัสผ่านใหม่",
    confirmLabel: "ยืนยันรหัสผ่านใหม่",
    confirmPlaceholder: "กรอกรหัสผ่านใหม่อีกครั้ง",
    submitText: "บันทึกรหัสผ่านใหม่",
    successText: "เปลี่ยนรหัสผ่านสำเร็จ กำลังพาไปหน้าเข้าสู่ระบบ",
    helperTitle: "คำแนะนำรหัสผ่านใหม่",
    helperText:
      "ควรตั้งรหัสผ่านที่เดายาก มีอย่างน้อย 8 ตัวอักษร และไม่ใช้รหัสผ่านเดิมที่เคยใช้",
    linkNote: "ลิงก์รีเซ็ตรหัสผ่านนี้ใช้ได้ครั้งเดียวและมีเวลาจำกัด",
  },
};

function SetPasswordPage() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const mode = searchParams.get("mode") === "invite" ? "invite" : "reset";
  const content = pageContent[mode];

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let valid = true;

    setPasswordError("");
    setConfirmError("");
    setServerError("");

    if (!password.trim()) {
      setPasswordError("กรุณากรอกรหัสผ่านใหม่");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      valid = false;
    }

    if (!confirmPassword.trim()) {
      setConfirmError("กรุณายืนยันรหัสผ่าน");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("รหัสผ่านไม่ตรงกัน");
      valid = false;
    }

    if (!token) {
      setServerError("ไม่พบ token สำหรับตั้งรหัสผ่าน");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await axios.post(`${apiUrl}/set-password`, {
        token,
        password,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      setServerError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "ไม่สามารถตั้งรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: { xs: 3, sm: 4 },
          p: { xs: 3, sm: 4 },
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: success ? "#dcfce7" : content.iconBg,
                  color: success ? "#16a34a" : content.iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {success ? (
                  <CheckCircleOutlineIcon fontSize="medium" />
                ) : (
                  content.icon
                )}
              </Box>
            </Box>

            <Box textAlign="center">
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ fontSize: { xs: 24, sm: 28 } }}
              >
                {content.title}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  fontSize: { xs: 14, sm: 15 },
                  lineHeight: 1.7,
                }}
              >
                {content.subtitle}
              </Typography>
            </Box>

            {serverError && <Alert severity="error">{serverError}</Alert>}

            {success && (
              <Alert severity="success">
                {content.successText}
              </Alert>
            )}

            <Stack spacing={2.2}>
              <TextField
                label={content.passwordLabel}
                type={showPassword ? "text" : "password"}
                fullWidth
                placeholder={content.passwordPlaceholder}
                value={password}
                error={Boolean(passwordError)}
                helperText={passwordError}
                disabled={loading || success}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label={content.confirmLabel}
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                placeholder={content.confirmPlaceholder}
                value={confirmPassword}
                error={Boolean(confirmError)}
                helperText={confirmError}
                disabled={loading || success}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  bgcolor: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Typography fontSize={14} fontWeight={600} mb={0.8}>
                  {content.helperTitle}
                </Typography>
                <Typography
                  color="text.secondary"
                  fontSize={13.5}
                  lineHeight={1.7}
                >
                  {content.helperText}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || success}
                sx={{
                  mt: 1,
                  py: 1.25,
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: "none",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  content.submitText
                )}
              </Button>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{ color: "text.secondary" }}
            >
              <MarkEmailReadOutlinedIcon fontSize="small" />
              <Typography fontSize={13.5}>
                {content.linkNote}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default SetPasswordPage;
