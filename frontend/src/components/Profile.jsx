import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import {
  getProfileGradient,
  getProfileInitials,
} from "../layout/ProfileInitialsAvatar";

function Profile() {
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5011";
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user_id);
  const storedUser = useSelector((state) => state.user);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const roleMeta = useMemo(() => {
    const roleID = profile?.role_id ?? storedUser?.role_id;
    const roleName = profile?.role_name;
    const map = {
      1: { label: roleName || "admin", color: "error" },
      2: { label: roleName || "manager", color: "warning" },
      3: { label: roleName || "technician", color: "info" },
      4: { label: roleName || "user", color: "success" },
    };

    return map[Number(roleID)] ?? { label: roleName || "-", color: "default" };
  }, [profile, storedUser]);

  const statusMeta = useMemo(() => {
    const status = profile?.status || "inactive";
    const map = {
      active: { label: "พร้อมใช้งาน", color: "success" },
      inactive: { label: "ไม่พร้อมใช้งาน", color: "default" },
      suspended: { label: "ถูกระงับ", color: "warning" },
    };

    return map[status] ?? { label: status, color: "default" };
  }, [profile]);

  const fullName = useMemo(() => {
    const firstName = profile?.first_name ?? storedUser?.first_name ?? "";
    const lastName = profile?.last_name ?? storedUser?.last_name ?? "";
    const name = `${firstName} ${lastName}`.trim();

    return name || "-";
  }, [profile, storedUser]);

  const initials = useMemo(() => {
    const firstName = profile?.first_name ?? storedUser?.first_name ?? "";
    const lastName = profile?.last_name ?? storedUser?.last_name ?? "";
    return getProfileInitials(firstName, lastName, fullName);
  }, [profile, storedUser, fullName]);

  const avatarBackground = useMemo(() => {
    const firstName = profile?.first_name ?? storedUser?.first_name ?? "";
    const lastName = profile?.last_name ?? storedUser?.last_name ?? "";
    const source = `${firstName}${lastName}${storedUser?.full_name ?? ""}${profile?.user_id ?? userId ?? ""}`;

    return getProfileGradient(source);
  }, [profile, storedUser]);

  useEffect(() => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    let alive = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${apiUrl}/current-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data?.result ?? response.data;
        if (!alive) return;

        setProfile({
          ...data,
          department_id: data?.department_id ?? data?.dep_id,
          department_name: data?.department_name ?? data?.dep_name,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (!alive) return;
        setError("โหลดข้อมูลโปรไฟล์ไม่สำเร็จ");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      alive = false;
    };
  }, [apiUrl, token, userId]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            ข้อมูลส่วนตัว
          </Typography>
          <Typography color="text.secondary">
            ข้อมูลบัญชีและสิทธิ์การใช้งานของคุณ
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip
            label={roleMeta.label}
            color={roleMeta.color}
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label={statusMeta.label}
            color={statusMeta.color}
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={2}
        sx={{
          overflow: "hidden",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <Typography fontWeight={700}>โปรไฟล์ผู้ใช้งาน</Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          }}
        >
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              borderRight: { md: "1px solid" },
              borderBottom: { xs: "1px solid", md: "none" },
              borderColor: "divider",
            }}
          >
            <Stack spacing={2} alignItems="center" textAlign="center">
              {loading ? (
                <Skeleton variant="circular" width={112} height={112} />
              ) : (
                <Avatar
                  sx={{
                    width: 112,
                    height: 112,
                    fontSize: 36,
                    fontWeight: 800,
                    background: avatarBackground,
                    boxShadow: "0 18px 38px rgba(15, 23, 42, 0.2)",
                    border: "3px solid rgba(255, 255, 255, 0.9)",
                  }}
                >
                  {initials}
                </Avatar>
              )}

              <Box sx={{ width: "100%" }}>
                {loading ? (
                  <>
                    <Skeleton width="70%" sx={{ mx: "auto" }} />
                    <Skeleton width="45%" sx={{ mx: "auto" }} />
                  </>
                ) : (
                  <>
                    <Typography variant="h6" fontWeight={800}>
                      {fullName}
                    </Typography>
                    <Typography color="text.secondary" fontSize={14}>
                      User ID: {profile?.user_id ?? userId ?? "-"}
                    </Typography>
                  </>
                )}
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography fontWeight={800} sx={{ mb: 1 }}>
              รายละเอียดบัญชี
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1}>
              <InfoRow
                icon={<AccountCircleOutlinedIcon />}
                label="ชื่อ-นามสกุล"
                value={fullName}
                loading={loading}
              />
              <InfoRow
                icon={<EmailOutlinedIcon />}
                label="อีเมล"
                value={profile?.email || "-"}
                loading={loading}
              />
              <InfoRow
                icon={<LocalPhoneOutlinedIcon />}
                label="เบอร์โทรศัพท์"
                value={profile?.phone || "-"}
                loading={loading}
              />
              <InfoRow
                icon={<BadgeOutlinedIcon />}
                label="บทบาท"
                value={roleMeta.label}
                loading={loading}
              />
              <InfoRow
                icon={<BusinessOutlinedIcon />}
                label="แผนก"
                value={profile?.department_name || "ไม่มีแผนก"}
                loading={loading}
              />
              <InfoRow
                icon={<VerifiedUserOutlinedIcon />}
                label="สถานะบัญชี"
                value={statusMeta.label}
                loading={loading}
              />
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

function InfoRow({ icon, label, value, loading }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "220px 1fr" },
        gap: { xs: 0.5, sm: 2 },
        alignItems: "center",
        py: 1.25,
        borderBottom: "1px dashed",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
        <Typography color="text.secondary">{label}</Typography>
      </Stack>

      {loading ? (
        <Skeleton width="60%" />
      ) : (
        <Typography fontWeight={700} sx={{ wordBreak: "break-word" }}>
          {value}
        </Typography>
      )}
    </Box>
  );
}

export default Profile;
