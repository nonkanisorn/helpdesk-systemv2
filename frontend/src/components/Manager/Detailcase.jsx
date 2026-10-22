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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
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

  const [selectedTech, setSelectedTech] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [changeReason, setChangeReason] = useState("");

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
        axios
          .get(`${apiUrl}/users/by-permission/view_assigned_ticket`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch(() =>
            axios.get(`${apiUrl}/users/by-role/${roleTechnician}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          ),
        axios.get(`${apiUrl}/tickets-detail/${ticket_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const technicianData =
        technicianResponse.data.result?.map((technician) => ({
          id: technician.user_id ?? technician.id,
          fullName: `${technician.first_name || ""} ${
            technician.last_name || ""
          }`.trim(),
          avatar: getAvatarUrl(technician.avatar_path ?? technician.user_img),
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

  const handleOpenAssignModal = (tech) => {
    setSelectedTech(tech);
    setChangeReason("");
    setOpenConfirmDialog(true);
  };

  const executeAssign = async () => {
    if (!selectedTech) return;

    try {
      setAssigningId(selectedTech.id);

      await axios.patch(
        `${apiUrl}/tickets/${ticket_id}/assign-technician`,
        {
          technician_id: selectedTech.id,
          manager_id: managerId,
          reason: changeReason.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setOpenConfirmDialog(false);
      navigate("/manager/reportticket");
    } catch (error) {
      console.error("Error assigning technician:", error);
      alert("เกิดข้อผิดพลาดในการมอบหมายช่าง");
    } finally {
      setAssigningId(null);
    }
  };

  useEffect(() => {
    if (token && ticket_id) fetchData();
  }, [token, ticket_id]);

  const currentTechId = ticketData?.technician_id;
  const isReassign = Boolean(currentTechId);
  const isWaitingReview = Number(ticketData?.status_id) === 7;
  const currentTechFullName =
    `${ticketData?.technician_first_name || ""} ${
      ticketData?.technician_last_name || ""
    }`.trim() || (currentTechId ? `รหัสช่าง ${currentTechId}` : "");

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
                {isReassign ? "เปลี่ยนช่างเทคนิค" : "มอบหมายช่าง"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {isReassign
                  ? "เลือกช่างคนใหม่เพื่อรับผิดชอบรายการแจ้งซ่อมนี้แทนช่างเดิม"
                  : "เลือกช่างที่เหมาะสมเพื่อรับผิดชอบรายการแจ้งซ่อมนี้"}
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
                ชื่องานแจ้งซ่อม
              </Typography>

              <Typography fontWeight={600} sx={{ wordBreak: "break-word" }}>
                {ticketData.title}
              </Typography>
            </Paper>
          )}

          {isReassign && (
            <Alert
              severity="warning"
              icon={<WarningAmberRoundedIcon />}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              <Typography variant="body2">
                <b>ช่างปัจจุบันที่ได้รับมอบหมาย:</b> {currentTechFullName}
              </Typography>
              {ticketData?.reassign_info?.technician_reason && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <b>เหตุผลที่ช่างแจ้งไม่สามารถปฏิบัติงานได้:</b>{" "}
                  {ticketData.reassign_info.technician_reason}
                </Typography>
              )}
              {ticketData?.reassign_info?.user_rejection_reason && (
                <Typography variant="body2" sx={{ mt: 0.5, color: "error.main" }}>
                  <b>ผู้ใช้ขอให้ตรวจสอบอีกครั้ง:</b>{" "}
                  {ticketData.reassign_info.user_rejection_reason}
                  {ticketData.reassign_info.user_name &&
                    ` (แจ้งโดย: ${ticketData.reassign_info.user_name})`}
                </Typography>
              )}
            </Alert>
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

              {technicians.map((tech) => {
                const isCurrent = currentTechId && tech.id === currentTechId;

                return (
                  <Grid item xs={12} md={6} key={tech.id}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        height: "100%",
                        borderColor: isCurrent ? "warning.main" : undefined,
                        bgcolor: isCurrent ? "#fffbf2" : undefined,
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

                              {isCurrent && (
                                <Chip
                                  label="ช่างปัจจุบัน"
                                  color="warning"
                                  size="small"
                                />
                              )}
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
                          color={isCurrent && isWaitingReview ? "primary" : isReassign ? "warning" : "primary"}
                          fullWidth
                          disabled={(isCurrent && !isWaitingReview) || assigningId === tech.id}
                          onClick={() => handleOpenAssignModal(tech)}
                        >
                          {assigningId === tech.id
                            ? "กำลังดำเนินการ..."
                            : isCurrent && isWaitingReview
                            ? "ส่งกลับให้ช่างคนเดิมแก้ไข"
                            : isCurrent
                            ? "ช่างคนปัจจุบัน"
                            : isReassign
                            ? "เปลี่ยนเป็นช่างคนนี้"
                            : "มอบหมายช่าง"}
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}

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

      {/* Confirmation & Reason Dialog */}
      {(() => {
        const isAssigningSameTech =
          Boolean(selectedTech && currentTechId && selectedTech.id === currentTechId);

        return (
          <Dialog
            open={openConfirmDialog}
            onClose={() => !assigningId && setOpenConfirmDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ fontWeight: 600 }}>
              {isAssigningSameTech
                ? "ยืนยันส่งงานกลับให้ช่างคนเดิม"
                : isReassign
                ? "ยืนยันการเปลี่ยนช่างเทคนิค"
                : "ยืนยันการมอบหมายช่าง"}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {isAssigningSameTech ? (
                  <>
                    ต้องการส่งรายการแจ้งซ่อมนี้กลับให้{" "}
                    <b>{selectedTech?.fullName}</b> ดำเนินการตรวจสอบและแก้ไขเพิ่มเติมใช่ไหม?
                  </>
                ) : (
                  <>
                    ต้องการมอบหมายงานนี้ให้{" "}
                    <b>{selectedTech?.fullName}</b> ใช่ไหม?
                  </>
                )}
              </Typography>

              {(isReassign || isAssigningSameTech) && (
                <TextField
                  autoFocus
                  fullWidth
                  multiline
                  rows={3}
                  label={
                    isAssigningSameTech
                      ? "คำแนะนำเพิ่มเติมถึงช่าง (ไม่บังคับ)"
                      : "เหตุผลในการเปลี่ยนช่าง (ไม่บังคับ)"
                  }
                  placeholder={
                    isAssigningSameTech
                      ? "ระบุคำแนะนำ เช่น กรุณาตรวจสอบตามอาการที่ผู้ใช้แจ้งเพิ่มเติม"
                      : "ระบุเหตุผล เช่น ช่างเดิมติดภารกิจด่วน, มอบหมายผู้เชี่ยวชาญเฉพาะทาง"
                  }
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  disabled={Boolean(assigningId)}
                />
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setOpenConfirmDialog(false)}
                disabled={Boolean(assigningId)}
                color="inherit"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={executeAssign}
                disabled={Boolean(assigningId)}
                variant="contained"
                color={isAssigningSameTech ? "primary" : isReassign ? "warning" : "primary"}
              >
                {assigningId
                  ? "กำลังบันทึก..."
                  : isAssigningSameTech
                  ? "ยืนยันส่งงานต่อ"
                  : isReassign
                  ? "ยืนยันเปลี่ยนช่าง"
                  : "ยืนยันมอบหมาย"}
              </Button>
            </DialogActions>
          </Dialog>
        );
      })()}
    </Box>
  );
};
