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
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { amber, blue, green, grey, orange, red } from "@mui/material/colors";

function Detailcase() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const [ticketData, setTicketData] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const roleId = useSelector((state) => state.user.role_id);
  const token = useSelector((state) => state.user.token);

  const statusMap = {
    1: {
      label: "เปิดงาน",
      color: "info",
      icon: <ErrorOutlineRoundedIcon sx={{ color: blue[600] }} />,
    },
    2: {
      label: "มอบหมายแล้ว",
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
      label: "ยกเลิก",
      color: "error",
      icon: <ErrorOutlineRoundedIcon sx={{ color: red[600] }} />,
    },
    7: {
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
      const res = await axios.get(`${apiUrl}/tickets-detail/${ticket_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTicketData(res.data.result ?? res.data);
    } catch (error) {
      console.error("Error fetching ticket detail:", error);
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
        { status_id: 7 },
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

      await fetchDetail();
    } catch (error) {
      console.error("Error confirming repair:", error);
    } finally {
      setLoadingAction(false);
    }
  };

  if (!ticketData) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
        <CircularProgress size={28} />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          กำลังโหลดข้อมูล...
        </Typography>
      </Paper>
    );
  }

  const currentStatus = statusMap[ticketData.status_id] ?? {
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
      label: "มอบหมายแล้ว",
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
                      รหัสแผนก: {showText(ticketData.user_department_id)}
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

              {isHardwareCategory() && (
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
                  {roleId === 3 && ticketData.status_id === 2 && (
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={loadingAction}
                      onClick={startJobForTechnician}
                    >
                      เริ่มงาน
                    </Button>
                  )}

                  {roleId === 3 && ticketData.status_id === 3 && (
                    <>
                      <Button
                        component={Link}
                        to={`/technician/ticket/${ticket_id}/repair`}
                        variant="contained"
                        fullWidth
                        disabled={loadingAction}
                      >
                        บันทึกการซ่อม
                      </Button>

                      <Button
                        variant="outlined"
                        color="warning"
                        fullWidth
                        disabled={loadingAction}
                        onClick={waitingForPartButton}
                      >
                        รออะไหล่
                      </Button>
                    </>
                  )}

                  {roleId === 3 && [4, 5, 6].includes(ticketData.status_id) && (
                    <Button variant="contained" fullWidth disabled>
                      บันทึกการซ่อมแล้ว
                    </Button>
                  )}

                  {roleId === 4 && ticketData.status_id === 4 && (
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      disabled={loadingAction}
                      onClick={handleUpdateStatusTicketByUser}
                    >
                      ยืนยันการซ่อม
                    </Button>
                  )}

                  {roleId === 2 && ticketData.status_id === 1 && (
                    <Button
                      variant="contained"
                      fullWidth
                      disabled={loadingAction}
                      onClick={() =>
                        navigate(`/manager/ticket/assign/${ticket_id}`)
                      }
                    >
                      มอบหมายงาน
                    </Button>
                  )}

                  {!(
                    (roleId === 3 &&
                      [2, 3, 4, 5, 6].includes(ticketData.status_id)) ||
                    (roleId === 4 && ticketData.status_id === 4) ||
                    (roleId === 2 && ticketData.status_id === 1)
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
    </Box>
  );
}

export default Detailcase;
