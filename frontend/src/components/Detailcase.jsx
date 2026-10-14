import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HandymanIcon from "@mui/icons-material/Handyman";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { amber, blue, green, grey, orange, red } from "@mui/material/colors";
import { hasPermission } from "../auth/permissions";

function Detailcase() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const [ticketData, setTicketData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const token = useSelector((state) => state.user.token);
  const permissions = useSelector((state) => state.user.permissions);
  const isEndUserView = window.location.pathname.startsWith("/user/");

  const statusMap = {
    1: {
      label: "เปิดงาน",
      color: "info",
      icon: <ErrorOutlineRoundedIcon sx={{ color: blue[600] }} />,
    },
    2: {
      label: "มอบหมายงาน",
      color: "warning",
      icon: <AssignmentIndIcon sx={{ color: amber[700] }} />,
    },
    3: {
      label: "กำลังดำเนินการ",
      color: "info",
      icon: <HandymanIcon sx={{ color: blue[600] }} />,
    },
    4: {
      label: "รอผู้ใช้ยืนยัน",
      color: "warning",
      icon: <HourglassEmptyIcon sx={{ color: orange[700] }} />,
    },
    5: {
      label: "เสร็จสิ้น",
      color: "success",
      icon: <CheckCircleOutlineRoundedIcon sx={{ color: green[700] }} />,
    },
    6: {
      label: "รออะไหล่",
      color: "default",
      icon: <PrecisionManufacturingIcon sx={{ color: grey[700] }} />,
    },
  };

  const categoryMap = {
    1: "ฮาร์ดแวร์",
    2: "ซอฟต์แวร์",
    3: "อินเทอร์เน็ต / เครือข่าย",
    4: "อื่นๆ",
  };

  const formatDateTime = (date) => {
    if (!date) return "ยังไม่มีข้อมูล";

    return new Date(date).toLocaleString("th-TH", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const showText = (value, fallback = "ยังไม่มีข้อมูล") => {
    if (value === null || value === undefined || value === "") return fallback;
    return value;
  };

  const getFullName = (firstName, lastName, fallback = "ยังไม่มีข้อมูล") => {
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    return fullName || fallback;
  };

  const getCategoryName = () => {
    if (ticketData.issues_categories_name) {
      return ticketData.issues_categories_name;
    }

    return (
      categoryMap[ticketData.issue_categories_id] ||
      categoryMap[ticketData.issues_categories_id] ||
      "ไม่ระบุประเภทปัญหา"
    );
  };

  const isHardwareCategory = () => {
    return (
      ticketData.issue_categories_id === 1 ||
      ticketData.issues_categories_id === 1 ||
      ticketData.issues_categories_name === "ฮาร์ดแวร์"
    );
  };

  const getUserFullName = () => {
    return getFullName(ticketData.user_first_name, ticketData.user_last_name);
  };

  const getManagerFullName = () => {
    return getFullName(
      ticketData.manager_first_name,
      ticketData.manager_last_name,
      ticketData.manager_id
        ? `รหัสผู้มอบหมาย ${ticketData.manager_id}`
        : "ยังไม่ได้มอบหมาย",
    );
  };

  const getTechnicianFullName = () => {
    return getFullName(
      ticketData.technician_first_name,
      ticketData.technician_last_name,
      ticketData.technician_id
        ? `รหัสช่าง ${ticketData.technician_id}`
        : "ยังไม่ได้มอบหมายช่าง",
    );
  };

  const fetchDetail = async () => {
    try {
      setLoadError("");
      const res = await axios.get(`${apiUrl}/tickets-detail/${ticket_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTicketData(res.data.result ?? res.data);
    } catch (error) {
      console.error("Error fetching ticket detail:", error);
      setLoadError("ไม่สามารถโหลดรายละเอียดการซ่อมได้");
    }
  };

  useEffect(() => {
    if (token && ticket_id) fetchDetail();
  }, [token, ticket_id]);

  const startJobForTechnician = async () => {
    const confirmStart = window.confirm("ต้องการเริ่มงานนี้ใช่ไหม?");
    if (!confirmStart) return;

    try {
      setLoadingAction(true);

      await axios.patch(
        `${apiUrl}/technician/${ticket_id}/start`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await fetchDetail();
    } catch (error) {
      console.error("Error starting job:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const waitingForPartButton = async () => {
    const confirmWaitPart = window.confirm(
      "ต้องการเปลี่ยนสถานะเป็นรออะไหล่ใช่ไหม?",
    );
    if (!confirmWaitPart) return;

    try {
      setLoadingAction(true);

      await axios.patch(
        `${apiUrl}/technician/${ticket_id}/waitingpart`,
        { status_id: 6 },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await fetchDetail();
    } catch (error) {
      console.error("Error updating waiting parts:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateStatusTicketByUser = async () => {
    const confirmRepair = window.confirm("ยืนยันการซ่อมใช่ไหม?");
    if (!confirmRepair) return;

    try {
      setLoadingAction(true);

      await axios.patch(
        `${apiUrl}/tickets/${ticket_id}/confirmation`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setNotification({
        open: true,
        severity: "success",
        message: "ยืนยันการซ่อมสำเร็จ",
      });
      await fetchDetail();
    } catch (error) {
      console.error("Error confirming repair:", error);
      setNotification({
        open: true,
        severity: "error",
        message: "ยืนยันการซ่อมไม่สำเร็จ",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleRejectRepairByUser = async () => {
    const confirmReject = window.confirm(
      "ต้องการส่งงานกลับไปให้เมเนเจอร์ตรวจสอบอีกครั้งใช่ไหม?",
    );
    if (!confirmReject) return;

    try {
      setLoadingAction(true);

      await axios.patch(
        `${apiUrl}/tickets/${ticket_id}/reject-repair`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setNotification({
        open: true,
        severity: "success",
        message: "ส่งคำขอตรวจสอบอีกครั้งให้เมเนเจอร์แล้ว",
      });
      await fetchDetail();
    } catch (error) {
      console.error("Error rejecting repair:", error);
      setNotification({
        open: true,
        severity: "error",
        message: "ส่งกลับให้เมเนเจอร์ไม่สำเร็จ",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  if (!ticketData) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
        {loadError ? (
          <Typography color="error">{loadError}</Typography>
        ) : (
          <>
            <CircularProgress size={28} />
            <Typography sx={{ mt: 2 }} color="text.secondary">
              กำลังโหลดข้อมูล...
            </Typography>
          </>
        )}
      </Paper>
    );
  }

  const ticketStatusId = Number(ticketData.status_id);

  const canAssignTicket = hasPermission(permissions, "assign_ticket");
  const canUpdateTicketStatus = hasPermission(
    permissions,
    "update_ticket_status",
  );
  const canAddResolutionNote = hasPermission(
    permissions,
    "add_resolution_note",
  );
  const canConfirmRepair = hasPermission(permissions, "confirm_repair");

  const currentStatus = statusMap[ticketStatusId] ?? {
    label: "ไม่ทราบสถานะ",
    color: "default",
    icon: null,
  };

  const timelineItems = [
    {
      label: "เปิดงาน",
      date: ticketData.created_at,
      icon: <ErrorOutlineRoundedIcon />,
      color: amber[600],
    },
    {
      label: "มอบหมายงาน",
      date: ticketData.assigned_at,
      icon: <AssignmentIndIcon />,
      color: blue[600],
    },
    {
      label: "กำลังดำเนินการ",
      date: ticketData.started_at,
      icon: <HandymanIcon />,
      color: red[500],
    },
    {
      label: "รอผู้ใช้ยืนยัน",
      date: ticketData.completed_at,
      icon: <HourglassEmptyIcon />,
      color: orange[700],
    },
    {
      label: "เสร็จสิ้น",
      date: ticketData.closed_at,
      icon: <CheckCircleOutlineRoundedIcon />,
      color: green[700],
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                รายละเอียดการซ่อม
              </Typography>

              <Typography variant="body2" color="text.secondary">
                ข้อมูลและสถานะการดำเนินการของรายการแจ้งซ่อม
              </Typography>
            </Box>

            <Chip
              icon={currentStatus.icon}
              label={currentStatus.label}
              color={currentStatus.color}
              variant="outlined"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            />
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Paper
                elevation={2}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
              >
                <Stack spacing={2}>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    sx={{ wordBreak: "break-word" }}
                  >
                    {showText(ticketData.title, "ไม่มีหัวข้อ")}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 2.5, height: "100%" }}
                      >
                        <Stack direction="row" spacing={1.5}>
                          <DateRangeRoundedIcon sx={{ color: grey[600] }} />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              วันที่แจ้ง
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {formatDateTime(ticketData.created_at)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 2.5, height: "100%" }}
                      >
                        <Stack direction="row" spacing={1.5}>
                          <OutlinedFlagRoundedIcon sx={{ color: grey[600] }} />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ประเภทปัญหา
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                              {getCategoryName()}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Divider />

                  <Box>
                    <Typography fontWeight={600} sx={{ mb: 1 }}>
                      รายละเอียดปัญหา
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
                    >
                      {showText(ticketData.description, "ไม่มีรายละเอียดปัญหา")}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper
                elevation={2}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
              >
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                  ผลการซ่อม
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
                >
                  {showText(
                    ticketData.resolution_note,
                    "ยังไม่มีการบันทึกผลการซ่อม",
                  )}
                </Typography>
              </Paper>

              <Paper
                elevation={2}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
              >
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                  ประวัติการดำเนินงาน
                </Typography>

                <Timeline
                  position="right"
                  sx={{
                    p: 0,
                    m: 0,
                    "& .MuiTimelineItem-root": { minHeight: "unset" },
                    "& .MuiTimelineItem-root:before": {
                      flex: 0,
                      padding: 0,
                    },
                  }}
                >
                  {timelineItems.map((item, index) => (
                    <TimelineItem key={item.label}>
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            bgcolor: grey[100],
                            color: item.color,
                            boxShadow: "none",
                          }}
                        >
                          {item.icon}
                        </TimelineDot>

                        {index < timelineItems.length - 1 && (
                          <TimelineConnector />
                        )}
                      </TimelineSeparator>

                      <TimelineContent sx={{ py: 1 }}>
                        <Typography fontWeight={600}>{item.label}</Typography>

                        <Typography variant="body2" color="text.secondary">
                          วันที่: {formatDateTime(item.date)}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Paper>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper
                elevation={2}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
              >
                <Typography fontWeight={600} sx={{ mb: 2 }}>
                  ข้อมูลผู้แจ้ง
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <AccountCircleRoundedIcon
                    sx={{ fontSize: 48, color: blue[500] }}
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      fontWeight={600}
                      sx={{ wordBreak: "break-word" }}
                    >
                      {getUserFullName()}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Email: {showText(ticketData.user_email)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      เบอร์โทร: {showText(ticketData.user_phone)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      แผนก: {showText(ticketData.user_department_name)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Paper
                elevation={2}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
              >
                <Typography fontWeight={600} sx={{ mb: 2 }}>
                  ข้อมูลผู้มอบหมาย
                </Typography>

                <Stack spacing={1}>
                  <Typography variant="body2">
                    <b>ชื่อ:</b> {getManagerFullName()}
                  </Typography>

                  <Typography variant="body2">
                    <b>Email:</b> {showText(ticketData.manager_email)}
                  </Typography>

                  <Typography variant="body2">
                    <b>เบอร์โทร:</b> {showText(ticketData.manager_phone)}
                  </Typography>
                </Stack>
              </Paper>

              <Paper
                elevation={2}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
              >
                <Typography fontWeight={600} sx={{ mb: 2 }}>
                  ข้อมูลช่าง
                </Typography>

                <Stack spacing={1}>
                  <Typography variant="body2">
                    <b>ชื่อ:</b> {getTechnicianFullName()}
                  </Typography>

                  <Typography variant="body2">
                    <b>Email:</b> {showText(ticketData.technician_email)}
                  </Typography>

                  <Typography variant="body2">
                    <b>เบอร์โทร:</b> {showText(ticketData.technician_phone)}
                  </Typography>
                </Stack>
              </Paper>

              {!isEndUserView && isHardwareCategory() && (
                <Paper
                  elevation={2}
                  sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
                >
                  <Typography fontWeight={600} sx={{ mb: 2 }}>
                    ข้อมูลอุปกรณ์
                  </Typography>

                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <b>รหัสอุปกรณ์:</b> {showText(ticketData.instance_id)}
                    </Typography>

                    <Typography variant="body2">
                      <b>ชื่ออุปกรณ์:</b> {showText(ticketData.device_name)}
                    </Typography>

                    {/* <Typography variant="body2"> */}
                    {/*   <b>รุ่น:</b> {showText(ticketData.device_model)} */}
                    {/* </Typography> */}

                    <Typography variant="body2">
                      <b>Serial Number:</b> {showText(ticketData.serial_number)}
                    </Typography>

                    {/* <Typography variant="body2"> */}
                    {/*   <b>สถานที่:</b> {showText(ticketData.device_location)} */}
                    {/* </Typography> */}
                  </Stack>
                </Paper>
              )}

              <Paper
                elevation={2}
                sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
              >
                <Typography fontWeight={600} sx={{ mb: 2 }}>
                  การดำเนินการ
                </Typography>

                <Stack spacing={1}>
                  {canUpdateTicketStatus && ticketStatusId === 2 && (
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PlayArrowRoundedIcon />}
                      disabled={loadingAction}
                      onClick={startJobForTechnician}
                      sx={{
                        py: 1.1,
                        borderRadius: 99,
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "0 6px 16px rgba(25, 118, 210, 0.24)",
                        transition: "transform 180ms ease, box-shadow 180ms ease",
                        "&:hover": {
                          boxShadow: "0 10px 22px rgba(25, 118, 210, 0.32)",
                          transform: "translateY(-2px)",
                        },
                        "&.Mui-disabled": {
                          boxShadow: "none",
                        },
                      }}
                    >
                      เริ่มงาน
                    </Button>
                  )}

                  {canAddResolutionNote && [3, 6].includes(ticketStatusId) && (
                    <>
                      <Button
                        component={Link}
                        to={`/technician/ticket/${ticket_id}/repair`}
                        variant="contained"
                        fullWidth
                        endIcon={<EditNoteRoundedIcon />}
                        disabled={loadingAction}
                        sx={{
                          py: 1.25,
                          borderRadius: 99,
                          fontWeight: 700,
                          textTransform: "none",
                          background:
                            "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                          boxShadow: "0 8px 18px rgba(25, 118, 210, 0.28)",
                          transition:
                            "transform 180ms ease, box-shadow 180ms ease, filter 180ms ease",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
                            boxShadow: "0 12px 26px rgba(25, 118, 210, 0.34)",
                            filter: "saturate(1.08)",
                            transform: "translateY(-2px)",
                          },
                          "&.Mui-disabled": {
                            boxShadow: "none",
                          },
                        }}
                      >
                        บันทึกการซ่อม
                      </Button>

                      {canUpdateTicketStatus && ticketStatusId === 3 && (
                        <Button
                          variant="outlined"
                          color="warning"
                          fullWidth
                          startIcon={<Inventory2RoundedIcon />}
                          disabled={loadingAction}
                          onClick={waitingForPartButton}
                          sx={{
                            py: 1.15,
                            borderRadius: 99,
                            fontWeight: 700,
                            textTransform: "none",
                            borderColor: orange[200],
                            backgroundColor: orange[50],
                            color: orange[900],
                            transition:
                              "transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                            "&:hover": {
                              borderColor: orange[400],
                              backgroundColor: orange[100],
                              boxShadow: "0 8px 18px rgba(237, 108, 2, 0.2)",
                              transform: "translateY(-2px)",
                            },
                            "&.Mui-disabled": {
                              boxShadow: "none",
                            },
                          }}
                        >
                          รออะไหล่
                        </Button>
                      )}
                    </>
                  )}

                  {canAddResolutionNote && [4, 5].includes(ticketStatusId) && (
                    <Button variant="contained" fullWidth disabled>
                      บันทึกการซ่อมแล้ว
                    </Button>
                  )}

                  {canConfirmRepair && ticketStatusId === 4 && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={loadingAction}
                        onClick={handleUpdateStatusTicketByUser}
                      >
                        ยืนยันการซ่อม
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        disabled={loadingAction}
                        onClick={handleRejectRepairByUser}
                      >
                        ขอให้ตรวจสอบอีกครั้ง
                      </Button>
                    </>
                  )}

                  {canAssignTicket && ticketStatusId === 1 && (
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={loadingAction}
                      onClick={() =>
                        navigate(`/manager/ticket/assign/${ticket_id}`)
                      }
                    >
                      มอบหมายช่าง
                    </Button>
                  )}

                  {!(
                    (canUpdateTicketStatus && ticketStatusId === 2) ||
                    (canAddResolutionNote &&
                      [3, 4, 5, 6].includes(ticketStatusId)) ||
                    (canConfirmRepair && ticketStatusId === 4) ||
                    (canAssignTicket && ticketStatusId === 1)
                  ) && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        ไม่มีการดำเนินการในสถานะนี้
                      </Typography>
                    </Paper>
                  )}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() =>
            setNotification((prev) => ({ ...prev, open: false }))
          }
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Detailcase;
