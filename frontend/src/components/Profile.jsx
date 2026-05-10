import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
  Skeleton,
  Alert,
  Grid,
} from "@mui/material";

function Profile() {
  const role_id = useSelector((state) => state.user.role);
  const full_name = useSelector((state) => state.user.full_name);
  const user_id = useSelector((state) => state.user.user_id);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("/assets/user.png");
  const [dep, setDep] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const roleMeta = useMemo(() => {
    const map = {
      1: { label: "Admin", chipColor: "error" },
      2: { label: "Manager", chipColor: "warning" },
      3: { label: "Technician", chipColor: "info" },
      4: { label: "User", chipColor: "success" },
    };
    return map[role_id] ?? { label: "Unknown", chipColor: "default" };
  }, [role_id]);

  useEffect(() => {
    if (!user_id) return;

    let alive = true;
    setLoading(true);
    setError("");

    const fetchdata = async () => {
      try {
        const res = await axios.get(`http://localhost:5011/users/${user_id}`);
        const u = res.data?.[0];
        if (!u) throw new Error("ไม่พบข้อมูลผู้ใช้");

        if (!alive) return;

        setDep(u.dep_name ?? "");
        setEmail(u.email ?? "");
        setPhone(u.phone ?? "");
        const img = u.user_img;
        if (!img || !img.data || img.data.length === 0) {
          setUrl("/assets/user.png");
        } else {
          const array = new Uint8Array(img.data);
          const blob = new Blob([array], { type: "image/jpeg" });
          const objectUrl = URL.createObjectURL(blob);
          setUrl(objectUrl);
        }
      } catch (e) {
        console.log(e);
        if (!alive) return;
        setError("โหลดข้อมูลไม่สำเร็จ ลองรีเฟรชอีกครั้ง");
        setUrl("/assets/user.png");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchdata();

    return () => {
      alive = false;
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={900}>
            ข้อมูลส่วนตัว
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            ข้อมูลบัญชีผู้ใช้งานของคุณ
          </Typography>
        </Box>

        <Chip
          label={roleMeta.label}
          color={roleMeta.chipColor}
          variant="outlined"
          sx={{ fontWeight: 800 }}
        />
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {/* Content (ไม่เป็น Card) */}
      <Box
        sx={{
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/* Top band */}
        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: "rgba(25,118,210,0.06)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Typography fontWeight={800}>โปรไฟล์</Typography>
        </Box>

        <Grid container>
          {/* Left column */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              p: 3,
              borderRight: { md: "1px solid rgba(0,0,0,0.06)" },
              borderBottom: { xs: "1px solid rgba(0,0,0,0.06)", md: "none" },
            }}
          >
            <Stack spacing={2} alignItems={{ xs: "flex-start", md: "center" }}>
              {loading ? (
                <Skeleton variant="circular" width={110} height={110} />
              ) : (
                <Avatar
                  src={url}
                  sx={{
                    width: 110,
                    height: 110,
                    border: "3px solid rgba(25,118,210,0.25)",
                  }}
                />
              )}

              <Box sx={{ width: "100%" }}>
                {loading ? (
                  <>
                    <Skeleton width="70%" />
                    <Skeleton width="50%" />
                  </>
                ) : (
                  <>
                    <Typography variant="h6" fontWeight={900}>
                      {full_name || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                      User ID: {user_id}
                    </Typography>
                  </>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={8} sx={{ p: 3 }}>
            <Typography fontWeight={800} sx={{ mb: 1 }}>
              รายละเอียดบัญชี
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1.6}>
              <InfoRow
                label="ชื่อผู้ใช้"
                loading={loading}
                value={full_name || "-"}
              />
              <InfoRow
                label="แผนก"
                loading={loading}
                value={dep ? dep : "ไม่มีแผนก"}
              />
              <InfoRow label="อีเมล" loading={loading} value={email || "-"} />
              <InfoRow
                label="เบอร์โทร"
                loading={loading}
                value={phone || "-"}
              />
              <InfoRow
                label="ตำแหน่ง"
                loading={loading}
                value={roleMeta.label}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function InfoRow({ label, value, loading }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" },
        gap: 1,
        alignItems: "center",
        py: 1.1,
        borderBottom: "1px dashed rgba(0,0,0,0.12)",
      }}
    >
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        {label}
      </Typography>

      {loading ? (
        <Skeleton width="60%" />
      ) : (
        <Typography variant="body1" fontWeight={700}>
          {value}
        </Typography>
      )}
    </Box>
  );
}

export default Profile;
