import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Stack,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
} from "@mui/material";

import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { amber, blue, green, grey } from "@mui/material/colors";
import {
  technicianPrimaryButtonSx,
  technicianSecondaryButtonSx,
} from "../technician/buttonStyles";

function User() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [ticketData, setTicketData] = useState([]);

  const userId = useSelector((state) => state.user.user_id);
  const token = useSelector((state) => state.user.token);

  const limit = 2;

  const statusMap = {
    1: {
      label: "เปิดงาน",
      icon: <FiberNewIcon sx={{ color: blue[600] }} fontSize="small" />,
      color: "info",
    },
    2: {
      label: "มอบหมายช่างแล้ว",
      icon: <AssignmentIndIcon sx={{ color: amber[700] }} fontSize="small" />,
      color: "warning",
    },
    3: {
      label: "กำลังดำเนินการ",
      icon: <AutorenewIcon sx={{ color: blue[600] }} fontSize="small" />,
      color: "info",
    },
    4: {
      label: "รอผู้ใช้ยืนยัน",
      icon: <HourglassEmptyIcon sx={{ color: amber[700] }} fontSize="small" />,
      color: "warning",
    },
    5: {
      label: "ปิดงานแล้ว",
      icon: (
        <CheckCircleOutlineRoundedIcon
          sx={{ color: green[700] }}
          fontSize="small"
        />
      ),
      color: "success",
    },
    6: {
      label: "รออะไหล่",
      icon: (
        <PrecisionManufacturingIcon
          sx={{ color: grey[700] }}
          fontSize="small"
        />
      ),
      color: "default",
    },
    7: {
      label: "ส่งกลับตรวจสอบอีกครั้ง",
      icon: <HourglassEmptyIcon sx={{ color: amber[700] }} fontSize="small" />,
      color: "warning",
    },
  };

  const defaultStatus = {
    label: "ไม่ทราบสถานะ",
    icon: <HourglassEmptyIcon fontSize="small" />,
    color: "default",
  };

  const fetchLatestTickets = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/tickets/${userId}/latest/${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTicketData(response.data.result ?? response.data ?? []);
    } catch (error) {
      console.error("Error fetching latest tickets:", error);
    }
  };

  useEffect(() => {
    if (token && userId) fetchLatestTickets();
  }, [token, userId]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("th-TH", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ fontSize: { xs: "1.35rem", sm: "1.75rem" } }}
          >
            ยินดีต้อนรับสู่ระบบแจ้งซ่อม
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mx: "auto", maxWidth: 720 }}
          >
            เราพร้อมให้บริการและดูแลปัญหาของคุณอย่างรวดเร็วและมีประสิทธิภาพ
          </Typography>
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
              เริ่มต้นใช้งาน
            </Typography>

            <Typography variant="body2" color="text.secondary">
              เลือกเมนูที่ต้องการใช้งาน
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
                <Stack spacing={2} height="100%">
                  <AddBoxRoundedIcon sx={{ fontSize: 42, color: blue[600] }} />

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      แจ้งซ่อม
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      แจ้งปัญหาและขอรับบริการซ่อม
                    </Typography>
                  </Box>

                  <Button
                    component={Link}
                    to="/user/repair-request"
                    variant="contained"
                    fullWidth
                    sx={technicianPrimaryButtonSx}
                  >
                    เลือก
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
                <Stack spacing={2} height="100%">
                  <HistoryRoundedIcon
                    sx={{ fontSize: 42, color: green[600] }}
                  />

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      สถานะการซ่อม/ประวัติการซ่อมของฉัน
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      ดูรายการซ่อมทั้งหมดของคุณ
                    </Typography>
                  </Box>

                  <Button
                    component={Link}
                    to="/user/repair-history"
                    variant="contained"
                    fullWidth
                    sx={technicianPrimaryButtonSx}
                  >
                    เลือก
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

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
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                รายการล่าสุด
              </Typography>

              <Typography variant="body2" color="text.secondary">
                รายการแจ้งซ่อมล่าสุดของคุณ
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/user/repair-history"
              variant="outlined"
            sx={{
              ...technicianSecondaryButtonSx,
              width: { xs: "100%", sm: "auto" },
            }}
            >
              ดูทั้งหมด
            </Button>
          </Stack>

          <Stack spacing={1.5}>
            {ticketData.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
                <Typography variant="body2" color="text.secondary">
                  ยังไม่มีรายการแจ้งซ่อมล่าสุด
                </Typography>
              </Paper>
            ) : (
              ticketData.map((item) => {
                const status = statusMap[item.status_id] ?? defaultStatus;

                return (
                  <Paper
                    key={item.ticket_id}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2.5 }}
                  >
                    <Stack spacing={1.5}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        spacing={1.5}
                      >
                        <Box>
                          <Typography fontWeight={600}>
                            {item.title || "-"}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {formatDate(item.created_at)}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip
                            label={`เลขที่งาน: ${item.ticket_id}`}
                            size="small"
                            variant="outlined"
                          />

                          <Chip
                            icon={status.icon}
                            label={status.label}
                            size="small"
                            color={status.color}
                            variant="outlined"
                          />
                        </Stack>
                      </Stack>

                      <Divider />

                      <Button
                        component={Link}
                        to={`/user/repair-detail/${item.ticket_id}`}
                        variant="outlined"
                        sx={technicianSecondaryButtonSx}
                      >
                        ดูรายละเอียด
                      </Button>
                    </Stack>
                  </Paper>
                );
              })
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}

export default User;
