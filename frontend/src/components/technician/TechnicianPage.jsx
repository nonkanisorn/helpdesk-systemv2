import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

import { blue, orange, green, teal } from "@mui/material/colors";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PaperuiV2 from "../ui/PaperuiV2";

function Technicianpage() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [ticketData, setTicketData] = useState([]);

  const technicianId = useSelector((state) => state.user.user_id);
  const token = useSelector((state) => state.user.token);

  const summary = useMemo(() => {
    return {
      total: ticketData.length,
      inProgress: ticketData.filter((item) => Number(item.status_id) === 3)
        .length,
      waitingConfirm: ticketData.filter((item) => Number(item.status_id) === 4)
        .length,
      completed: ticketData.filter((item) => Number(item.status_id) === 5)
        .length,
    };
  }, [ticketData]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/technician/${technicianId}/tickets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setTicketData(response.data.result ?? response.data ?? []);
    } catch (error) {
      console.error("Error fetching technician tickets:", error);
    }
  };

  useEffect(() => {
    if (token && technicianId) fetchTickets();
  }, [token, technicianId]);

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
        {/* ===== Header ===== */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
          }}
        >
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              Dashboard ช่าง
            </Typography>

            <Typography variant="body2" color="text.secondary">
              จัดการงานและติดตามงานที่ได้รับมอบหมาย
            </Typography>
          </Stack>

          {/* ===== Summary ===== */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="งานที่ได้รับมอบหมาย"
                number={summary.total}
                icon={
                  <ConstructionRoundedIcon
                    sx={{ fontSize: 50, color: blue[600] }}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="รอการยืนยันจากผู้ใช้"
                number={summary.waitingConfirm}
                icon={
                  <PendingActionsRoundedIcon
                    sx={{ fontSize: 50, color: orange[500] }}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="เสร็จสิ้น"
                number={summary.completed}
                icon={
                  <CheckCircleOutlineRoundedIcon
                    sx={{ fontSize: 50, color: green[500] }}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <PaperuiV2
                title="กำลังดำเนินการ"
                number={summary.inProgress}
                icon={
                  <AutorenewRoundedIcon
                    sx={{ fontSize: 50, color: teal[500] }}
                  />
                }
              />
            </Grid>
          </Grid>
        </Paper>

        {/* ===== List ===== */}
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
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                งานที่ได้รับมอบหมาย
              </Typography>

              <Typography variant="body2" color="text.secondary">
                รายการงานซ่อมที่ถูกมอบหมายให้คุณดำเนินการ
              </Typography>
            </Box>

            <Chip
              label={`${summary.total} งาน`}
              variant="outlined"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            />
          </Stack>

          <Stack spacing={1.5}>
            {ticketData.map((item) => (
              <Paper
                key={item.ticket_id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                }}
              >
                <Stack spacing={1.5}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    spacing={1.5}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={600}>{item.title}</Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description || "-"}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label={`ID: ${item.ticket_id}`}
                        size="small"
                        variant="outlined"
                      />

                      {Number(item.status_id) === 3 && (
                        <Chip
                          label="กำลังดำเนินการ"
                          size="small"
                          color="info"
                        />
                      )}
                    </Stack>
                  </Stack>

                  <Divider />

                  <Typography variant="body2" fontWeight={500}>
                    มอบหมายเมื่อ {formatDate(item.assigned_at || item.created_at)}
                  </Typography>

                  <Button
                    component={Link}
                    to={`/technician/repairs/${item.ticket_id}`}
                    variant="contained"
                    sx={{ width: { xs: "100%", sm: "fit-content" } }}
                  >
                    ดูรายละเอียด
                  </Button>
                </Stack>
              </Paper>
            ))}

            {ticketData.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  ยังไม่มีงานที่ได้รับมอบหมาย
                </Typography>
              </Paper>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}

export default Technicianpage;
