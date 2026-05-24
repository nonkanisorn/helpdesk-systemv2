import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowBack,
  HomeOutlined,
  LockOutlined,
  SearchOffOutlined,
} from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { hasAnyPermission, hasPermission } from "../auth/permissions";

const getHomePath = (permissions) => {
  if (
    hasAnyPermission(permissions, [
      "manage_users",
      "manage_roles",
      "manage_departments",
      "manage_ticket_statuses",
      "manage_devices",
      "manage_issue_categories",
    ])
  ) {
    return "/admin/index";
  }

  if (hasAnyPermission(permissions, ["assign_ticket", "view_all_ticket"])) {
    return "/manager/index";
  }

  if (hasPermission(permissions, "view_assigned_ticket")) {
    return "/technician/index";
  }

  if (
    hasAnyPermission(permissions, [
      "create_ticket",
      "view_own_ticket",
      "confirm_repair",
    ])
  ) {
    return "/user";
  }

  return "/login";
};

const errorContent = {
  403: {
    icon: LockOutlined,
    eyebrow: "403 Forbidden",
    title: "ไม่มีสิทธิ์เข้าถึงหน้านี้",
    description:
      "บัญชีของคุณยังไม่มีสิทธิ์สำหรับเมนูนี้ หากจำเป็นต้องใช้งาน กรุณาติดต่อผู้ดูแลระบบเพื่อปรับสิทธิ์บทบาท",
    accent: "#D97706",
    badgeBg: "#FFF7ED",
  },
  404: {
    icon: SearchOffOutlined,
    eyebrow: "404 Not Found",
    title: "ไม่พบหน้าที่ต้องการ",
    description:
      "ลิงก์นี้อาจถูกย้าย เปลี่ยนชื่อ หรือไม่มีอยู่ในระบบ ลองกลับไปหน้าหลักแล้วเลือกเมนูอีกครั้ง",
    accent: "#2563EB",
    badgeBg: "#EFF6FF",
  },
};

export default function Notfound404({ statusCode = 404, text }) {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.user.permissions);
  const safeStatusCode = Number(statusCode) === 403 ? 403 : 404;
  const content = errorContent[safeStatusCode];
  const Icon = content.icon;
  const homePath = getHomePath(permissions);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F5F7FB",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          width: "min(100%, 980px)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 0.9fr" },
          alignItems: "center",
          gap: { xs: 4, md: 6 },
          bgcolor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: 2,
          boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
          p: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <Stack spacing={3}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              color: content.accent,
              bgcolor: content.badgeBg,
              border: `1px solid ${content.accent}22`,
            }}
          >
            <Icon fontSize="large" />
          </Box>

          <Stack spacing={1.5}>
            <Typography
              sx={{
                color: content.accent,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 0,
              }}
            >
              {content.eyebrow}
            </Typography>

            <Typography
              component="h1"
              sx={{
                color: "#111827",
                fontSize: { xs: 32, sm: 40, md: 48 },
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: 0,
              }}
            >
              {text || content.title}
            </Typography>

            <Typography
              sx={{
                color: "#4B5563",
                fontSize: { xs: 15, sm: 16 },
                lineHeight: 1.75,
                maxWidth: 560,
              }}
            >
              {content.description}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="contained"
              startIcon={<HomeOutlined />}
              onClick={() => navigate(homePath, { replace: true })}
              sx={{
                minHeight: 44,
                px: 2.5,
                bgcolor: "#111827",
                boxShadow: "none",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  bgcolor: "#1F2937",
                  boxShadow: "none",
                },
              }}
            >
              กลับหน้าหลัก
            </Button>

            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                minHeight: 44,
                px: 2.5,
                borderColor: "#D1D5DB",
                color: "#374151",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": {
                  borderColor: "#9CA3AF",
                  bgcolor: "#F9FAFB",
                },
              }}
            >
              ย้อนกลับ
            </Button>
          </Stack>
        </Stack>

        <Box
          aria-hidden="true"
          sx={{
            position: "relative",
            minHeight: { xs: 220, sm: 260, md: 340 },
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#F8FAFC",
            border: "1px solid #E5E7EB",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 24,
              borderRadius: 2,
              border: "1px solid #CBD5E1",
              bgcolor: "#FFFFFF",
              boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: 24,
              right: 24,
              top: 24,
              height: 44,
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
            }}
          >
            {[0, 1, 2].map((item) => (
              <Box
                key={item}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: ["#EF4444", "#F59E0B", "#10B981"][item],
                }}
              />
            ))}
          </Box>
          <Typography
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: `${content.accent}20`,
              fontSize: { xs: 112, sm: 144, md: 172 },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: 0,
              userSelect: "none",
            }}
          >
            {safeStatusCode}
          </Typography>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "54%",
              transform: "translate(-50%, -50%)",
              width: { xs: 88, sm: 104 },
              height: { xs: 88, sm: 104 },
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: content.accent,
              bgcolor: "#FFFFFF",
              border: `1px solid ${content.accent}33`,
              boxShadow: "0 16px 36px rgba(15, 23, 42, 0.14)",
            }}
          >
            <Icon sx={{ fontSize: { xs: 44, sm: 52 } }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
