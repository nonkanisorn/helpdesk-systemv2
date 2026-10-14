import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import { useSelector } from "react-redux";

export const Detailcase = () => {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;
  const managerId = useSelector((state) => state.user.user_id);
  const token = useSelector((state) => state.user.token);

  const [technicians, setTechnicians] = useState([]);
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const roleTechnician = 3;

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return "";

    if (typeof avatarPath === "string") {
      return avatarPath;
    }

    if (avatarPath?.data) {
      const array = new Uint8Array(avatarPath.data);
      const blob = new Blob([array], { type: "image/jpeg" });
      return URL.createObjectURL(blob);
    }

    return "";
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [technicianResponse, ticketResponse] = await Promise.all([
        axios.get(`${apiUrl}/users/by-role/${roleTechnician}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiUrl}/tickets/${ticket_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const technicianData =
        technicianResponse.data.result?.map((technician) => ({
          id: technician.user_id ?? technician.id,
          fullName: `${technician.first_name || ""} ${
            technician.last_name || ""
          }`.trim(),
          avatar: getAvatarUrl(technician.avatar_path),
          email: technician.email,
          phone: technician.phone,
        })) ?? [];

      setTechnicians(technicianData);
      setTicketData(ticketResponse.data.result ?? ticketResponse.data ?? null);
    } catch (error) {
      console.error("Error fetching technician assign data:", error);
      setTechnicians([]);
      setErrorMessage(
        error.response?.status === 403
          ? "ไม่มีสิทธิ์ดึงข้อมูลช่างสำหรับมอบหมายงาน"
          : "ไม่สามารถโหลดข้อมูลช่างได้",
      );
    } finally {
      setLoading(false);
    }
  };

  const assignTechnician = async (technicianId) => {
    const confirmAssign = window.confirm(
      "ต้องการมอบหมายงานให้ช่างคนนี้ใช่ไหม?",
    );
    if (!confirmAssign) return;

    try {
      setAssigningId(technicianId);

      await axios.patch(
        `${apiUrl}/tickets/${ticket_id}/assign-technician`,
        {
          technician_id: technicianId,
          manager_id: managerId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      navigate("/manager/reportticket");
    } catch (error) {
      console.error("Error assigning technician:", error);
    } finally {
      setAssigningId(null);
    }
  };

  useEffect(() => {
    if (token && ticket_id) fetchData();
  }, [token, ticket_id]);

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                มอบหมายช่าง
              </Typography>

              <Typography variant="body2" color="text.secondary">
                เลือกช่างที่เหมาะสมเพื่อรับผิดชอบรายการแจ้งซ่อมนี้
              </Typography>
            </Box>

            <Chip
              label={`เลขที่งาน: ${ticket_id}`}
              variant="outlined"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            />
          </Stack>

          {ticketData?.title && (
            <Paper
              variant="outlined"
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                งานที่ต้องมอบหมาย
              </Typography>

              <Typography fontWeight={600} sx={{ wordBreak: "break-word" }}>
                {ticketData.title}
              </Typography>
            </Paper>
          )}
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
          }}
        >
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              รายชื่อช่าง
            </Typography>

            <Typography variant="body2" color="text.secondary">
              แสดงช่างทั้งหมดที่สามารถรับงานได้
            </Typography>
          </Stack>

          {loading ? (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2.5,
                textAlign: "center",
              }}
            >
              <CircularProgress size={28} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                กำลังโหลดข้อมูลช่าง...
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={2}>
              {errorMessage && (
                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 2.5,
                      textAlign: "center",
                      borderColor: "error.light",
                    }}
                  >
                    <Typography color="error">{errorMessage}</Typography>
                  </Paper>
                </Grid>
              )}

              {technicians.map((tech) => (
                <Grid item xs={12} md={6} key={tech.id}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      height: "100%",
                    }}
                  >
                    <Stack spacing={2} height="100%">
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "center", sm: "flex-start" }}
                      >
                        <Avatar
                          src={tech.avatar}
                          sx={{
                            width: 72,
                            height: 72,
                          }}
                        >
                          <PersonIcon />
                        </Avatar>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.5, flexWrap: "wrap", gap: 1 }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight={600}
                              sx={{ wordBreak: "break-word" }}
                            >
                              {tech.fullName || "ไม่ระบุชื่อ"}
                            </Typography>

                            <Chip
                              icon={<EngineeringOutlinedIcon />}
                              label="ช่าง"
                              size="small"
                              variant="outlined"
                            />
                          </Stack>

                          <Stack spacing={0.75}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <EmailOutlinedIcon
                                fontSize="small"
                                color="disabled"
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ wordBreak: "break-word" }}
                              >
                                {tech.email || "-"}
                              </Typography>
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <PhoneOutlinedIcon
                                fontSize="small"
                                color="disabled"
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {tech.phone || "-"}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      </Stack>

                      <Box sx={{ flexGrow: 1 }} />

                      <Button
                        variant="contained"
                        fullWidth
                        disabled={assigningId === tech.id}
                        onClick={() => assignTechnician(tech.id)}
                      >
                        {assigningId === tech.id
                          ? "กำลังมอบหมาย..."
                          : "มอบหมายช่าง"}
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}

              {!errorMessage && technicians.length === 0 && (
                <Grid item xs={12}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 2.5,
                      textAlign: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      ไม่พบข้อมูลช่าง
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};
