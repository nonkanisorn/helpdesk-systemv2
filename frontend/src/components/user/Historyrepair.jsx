import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { technicianSecondaryButtonSx } from "../technician/buttonStyles";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Grid,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Paper,
  Divider,
} from "@mui/material";

function Historyrepair() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user_id);

  const [ticketData, setTicketData] = useState([]);
  const [groupKey, setGroupKey] = useState("all");

  const userStatusGroups = {
    all: { label: "ทั้งหมด", ids: null },
    pending: { label: "รอดำเนินการ", ids: [1, 2] },
    progress: { label: "อยู่ระหว่างซ่อม", ids: [3, 6, 7] },
    confirm: { label: "รอการยืนยัน", ids: [4] },
    done: { label: "เสร็จสิ้น", ids: [5] },
  };

  const userStatusLabelMap = {
    1: "เปิดงาน",
    2: "กำลังจัดสรรช่าง",
    3: "อยู่ระหว่างซ่อม",
    4: "รอการยืนยันจากคุณ",
    5: "เสร็จสิ้นแล้ว",
    6: "รออะไหล่",
    7: "ส่งกลับตรวจสอบอีกครั้ง",
  };

  const isRejectedTicket = (ticket) => {
    const statusId = Number(ticket?.status_id);
    if (statusId === 5) return false;

    return (
      statusId === 7 ||
      Boolean(ticket?.reassign_info?.user_rejection_reason)
    );
  };

  const chipPropsByStatus = (statusId, item) => {
    const id = Number(statusId);
    if (id === 5) return { color: "success", variant: "outlined" };
    if (isRejectedTicket(item || { status_id: id }))
      return { color: "error", variant: "outlined" };
    if (id === 3 || id === 6)
      return { color: "warning", variant: "outlined" };
    if (id === 4) return { color: "info", variant: "outlined" };

    return { color: "default", variant: "outlined" };
  };

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tickets/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTicketData(response.data.result ?? response.data ?? []);
    } catch (error) {
      console.error("Error fetching repair history:", error);
    }
  };

  useEffect(() => {
    if (token && userId) fetchTickets();
  }, [token, userId]);

  const filteredTickets = useMemo(() => {
    const ids = userStatusGroups[groupKey].ids;
    const baseList = ids
      ? ticketData.filter((item) => ids.includes(item.status_id))
      : ticketData;

    return [...baseList].sort((a, b) => {
      // 1. เคสส่งกลับ/ไม่ได้รับการยอมรับ ให้ความสำคัญสูงสุด ปักหมุดไว้บนสุดเสมอ
      const aIsRejected = isRejectedTicket(a);
      const bIsRejected = isRejectedTicket(b);
      if (aIsRejected && !bIsRejected) return -1;
      if (!aIsRejected && bIsRejected) return 1;

      // 2. ภายในกลุ่มเดียวกัน จัดเรียงตามเวลาล่าสุด (หรือ id ล่าสุด)
      const timeA = new Date(
        a.reassign_info?.user_rejected_at ||
        a.reassign_info?.reassigned_at ||
        a.completed_at ||
        a.created_at
      ).getTime();
      const timeB = new Date(
        b.reassign_info?.user_rejected_at ||
        b.reassign_info?.reassigned_at ||
        b.completed_at ||
        b.created_at
      ).getTime();

      if (!isNaN(timeA) && !isNaN(timeB) && timeB !== timeA) {
        return timeB - timeA;
      }

      return Number(b.ticket_id || 0) - Number(a.ticket_id || 0);
    });
  }, [ticketData, groupKey]);

  const countByGroup = (key) => {
    const ids = userStatusGroups[key].ids;
    if (!ids) return ticketData.length;

    return ticketData.filter((item) => ids.includes(item.status_id)).length;
  };

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
          }}
        >
          <Stack spacing={0.5} sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              ประวัติการซ่อมแจ้งซ่อมของฉัน
            </Typography>

            <Typography variant="body2" color="text.secondary">
              รายการคำขอซ่อมทั้งหมดของคุณ
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {Object.entries(userStatusGroups).map(([key, group]) => (
              <Grid key={key} item xs={6} sm={4} md={2.4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    height: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" fontWeight={600}>
                    {countByGroup(key)}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {group.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
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
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                รายการแจ้งซ่อม
              </Typography>

              <Typography variant="body2" color="text.secondary">
                กรองและดูรายละเอียดรายการแจ้งซ่อมของคุณ
              </Typography>
            </Box>

            <Chip
              label={`${filteredTickets.length} รายการ`}
              variant="outlined"
              sx={{ width: { xs: "100%", sm: "auto" } }}
            />
          </Stack>

          <Box
            sx={{
              overflowX: "auto",
              pb: 1,
              mb: 3,
            }}
          >
            <ToggleButtonGroup
              value={groupKey}
              exclusive
              color="primary"
              onChange={(event, newValue) => {
                if (newValue !== null) setGroupKey(newValue);
              }}
              sx={{
                display: "inline-flex",
                minWidth: "max-content",
                gap: 1,
                "& .MuiToggleButton-root": {
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  whiteSpace: "nowrap",
                },
                "& .MuiToggleButtonGroup-grouped": {
                  mx: 0,
                  borderRadius: 2,
                },
              }}
            >
              {Object.entries(userStatusGroups).map(([key, group]) => (
                <ToggleButton key={key} value={key}>
                  {group.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Grid container spacing={2}>
            {filteredTickets.map((item) => {
              const chipLabel =
                userStatusLabelMap[item.status_id] ?? "ไม่ทราบสถานะ";

              return (
                <Grid key={item.ticket_id} item xs={12} md={6}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      height: "100%",
                      borderColor: isRejectedTicket(item) ? "error.light" : undefined,
                      bgcolor: isRejectedTicket(item) ? "rgba(239, 68, 68, 0.03)" : undefined,
                    }}
                  >
                    <Stack spacing={1.5} height="100%">
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "flex-start" }}
                        spacing={1.5}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            fontWeight={600}
                            sx={{ wordBreak: "break-word" }}
                          >
                            {item.title}
                          </Typography>

                          {isRejectedTicket(item) && item.reassign_info?.user_rejection_reason && (
                            <Typography
                              variant="caption"
                              color="error.main"
                              sx={{ display: "block", mt: 0.5, fontWeight: 500 }}
                            >
                              เหตุผลที่ส่งกลับ: {item.reassign_info.user_rejection_reason}
                            </Typography>
                          )}

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                              wordBreak: "break-word",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.description || "-"}
                          </Typography>
                        </Box>

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ flexWrap: "wrap", gap: 1 }}
                        >
                          <Chip
                            label={`เลขที่งาน: ${item.ticket_id}`}
                            size="small"
                            variant="outlined"
                          />

                          <Chip
                            label={chipLabel}
                            size="small"
                            {...chipPropsByStatus(item.status_id, item)}
                          />
                        </Stack>
                      </Stack>

                      <Divider />

                      <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          แจ้งเมื่อ
                        </Typography>

                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(item.created_at)}
                        </Typography>
                      </Stack>

                      <Button
                        component={Link}
                        to={`/user/repair-detail/${item.ticket_id}`}
                        variant="outlined"
                        fullWidth
                        sx={technicianSecondaryButtonSx}
                      >
                        ดูรายละเอียด
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}

            {filteredTickets.length === 0 && (
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
                    ไม่พบรายการแจ้งซ่อมในหมวดนี้
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Stack>
    </Box>
  );
}

export default Historyrepair;
