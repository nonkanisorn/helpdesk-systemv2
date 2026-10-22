import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  technicianPrimaryButtonSx,
  technicianSecondaryButtonSx,
} from "./buttonStyles";

function Reportcasetech() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const technicianId = useSelector((state) => state.user.user_id);
  const token = useSelector((state) => state.user.token);

  const [ticketData, setTicketData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const formatDateThai = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "short", // 'short' = ม.ค., 'long' = มกราคม, '2-digit' = 01
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // ใช้แบบ 24 ชั่วโมง (เช่น 14:30)
    }).format(date);
  };
  const technicianStatusMap = {
    1: "งานใหม่",
    2: "ได้รับมอบหมาย",
    3: "กำลังดำเนินการ",
    4: "รอผู้ใช้ยืนยัน",
    5: "เสร็จสิ้น",
    6: "รออะไหล่",
    7: "รอผู้จัดการตรวจสอบ",
  };

  const statusChipProps = (statusId) => {
    if (statusId === 5) return { color: "success", variant: "outlined" };
    if (statusId === 3 || statusId === 6)
      return { color: "warning", variant: "outlined" };
    if (statusId === 4) return { color: "info", variant: "outlined" };

    return { color: "default", variant: "outlined" };
  };

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
      console.error("Error fetching technician report tickets:", error);
    }
  };

  useEffect(() => {
    if (token && technicianId) fetchTickets();
  }, [token, technicianId]);

  const isRejectedTicket = (ticket) => {
    const statusId = Number(ticket?.status_id);
    if (statusId === 5) return false;

    return (
      statusId === 7 ||
      Boolean(ticket?.reassign_info?.user_rejection_reason) ||
      Boolean(ticket?.resolution_note && statusId === 2)
    );
  };

  const assignedTickets = ticketData.filter((item) =>
    [2, 7].includes(Number(item.status_id)),
  );

  const sortedAssignedTickets = [...assignedTickets].sort((a, b) => {
    // 1. เคสส่งกลับ/ไม่ได้รับการยอมรับ ให้ความสำคัญสูงสุด อยู่บนสุดเสมอ (ปักหมุด)
    const aIsRejected = isRejectedTicket(a);
    const bIsRejected = isRejectedTicket(b);
    if (aIsRejected && !bIsRejected) return -1;
    if (!aIsRejected && bIsRejected) return 1;

    // 2. ภายในกลุ่มเดียวกัน จัดเรียงตามเวลาล่าสุด (หรือ id ล่าสุด)
    const timeA = new Date(
      a.reassign_info?.user_rejected_at ||
      a.reassign_info?.reassigned_at ||
      a.assigned_at ||
      a.completed_at ||
      a.created_at
    ).getTime();
    const timeB = new Date(
      b.reassign_info?.user_rejected_at ||
      b.reassign_info?.reassigned_at ||
      b.assigned_at ||
      b.completed_at ||
      b.created_at
    ).getTime();

    if (!isNaN(timeA) && !isNaN(timeB) && timeB !== timeA) {
      return timeB - timeA;
    }

    return Number(b.ticket_id || 0) - Number(a.ticket_id || 0);
  });

  const paginatedTickets = sortedAssignedTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleOpenDetail = (ticketId) => {
    navigate(`/technician/repairs/${ticketId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
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
              รายการงานซ่อมที่ได้รับมอบหมายและสามารถจัดการได้
            </Typography>
          </Box>

          <Chip
            label={`${assignedTickets.length} งาน`}
            variant="outlined"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          />
        </Stack>

        <TableContainer
          sx={{
            display: { xs: "none", md: "block" },
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>เลขที่งาน</TableCell>
                <TableCell>ชื่องาน</TableCell>
                <TableCell>วันที่ได้รับมอบหมาย</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell align="right">ดำเนินการ</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedTickets.map((item) => {
                const rejected = isRejectedTicket(item);
                return (
                  <TableRow
                    key={item.ticket_id}
                    hover
                    sx={
                      rejected
                        ? {
                            bgcolor: "rgba(239, 68, 68, 0.04)",
                            "&:hover": {
                              bgcolor: "rgba(239, 68, 68, 0.08) !important",
                            },
                          }
                        : undefined
                    }
                  >
                    <TableCell>{item.ticket_id}</TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>{item.title}</Typography>
                      {rejected && item.reassign_info?.user_rejection_reason && (
                        <Typography
                          variant="caption"
                          color="error.main"
                          sx={{ display: "block", mt: 0.5, fontWeight: 500 }}
                        >
                          เหตุผลที่ส่งกลับ: {item.reassign_info.user_rejection_reason}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDateThai(item.assigned_at || item.created_at)} น.
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          rejected
                            ? (Number(item.status_id) === 7 ? "รอผู้จัดการตรวจสอบ" : "ส่งกลับแก้ไข")
                            : (technicianStatusMap[item.status_id] ?? "ได้รับมอบหมาย")
                        }
                        size="small"
                        color={rejected ? "error" : statusChipProps(item.status_id).color}
                        variant={rejected ? "outlined" : statusChipProps(item.status_id).variant}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDetail(item.ticket_id)}
                        sx={technicianSecondaryButtonSx}
                      >
                        จัดการงาน
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {assignedTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    ไม่พบรายการแจ้งซ่อมที่ได้รับมอบหมาย
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          spacing={1.5}
          sx={{
            display: { xs: "flex", md: "none" },
          }}
        >
          {paginatedTickets.map((item) => {
            const rejected = isRejectedTicket(item);
            return (
              <Paper
                key={item.ticket_id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  borderColor: rejected ? "error.light" : undefined,
                  bgcolor: rejected ? "rgba(239, 68, 68, 0.03)" : undefined,
                }}
              >
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        ชื่องาน
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{
                          mt: 0.25,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.title}
                      </Typography>
                      {rejected && item.reassign_info?.user_rejection_reason && (
                        <Typography
                          variant="caption"
                          color="error.main"
                          sx={{ display: "block", mt: 0.5, fontWeight: 500 }}
                        >
                          เหตุผลที่ส่งกลับ: {item.reassign_info.user_rejection_reason}
                        </Typography>
                      )}
                    </Box>

                    <Chip
                      label={`เลขที่งาน: ${item.ticket_id}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      ผู้แจ้ง
                    </Typography>

                    <Typography variant="body2" fontWeight={500}>
                      {item.usersname || "-"}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      รายละเอียดงาน
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        wordBreak: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description || "-"}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      สถานะ
                    </Typography>

                    <Chip
                      label={
                        rejected
                          ? (Number(item.status_id) === 7 ? "รอผู้จัดการตรวจสอบ" : "ส่งกลับแก้ไข")
                          : (technicianStatusMap[item.status_id] ?? "ได้รับมอบหมาย")
                      }
                      size="small"
                      color={rejected ? "error" : statusChipProps(item.status_id).color}
                      variant={rejected ? "outlined" : statusChipProps(item.status_id).variant}
                      sx={{ width: "fit-content" }}
                    />
                  </Stack>

                  <Divider />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleOpenDetail(item.ticket_id)}
                  sx={technicianPrimaryButtonSx}
                >
                  จัดการงาน
                </Button>
              </Stack>
            </Paper>
          );
        })}

          {assignedTickets.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2.5,
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">
                ไม่พบรายการแจ้งซ่อมที่ได้รับมอบหมาย
              </Typography>
            </Paper>
          )}
        </Stack>

        <TablePagination
          component="div"
          count={assignedTickets.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="แถวต่อหน้า"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} จาก ${count}`
          }
          sx={{
            mt: 2,
            ".MuiTablePagination-toolbar": {
              px: { xs: 0, sm: 2 },
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
              gap: 1,
            },
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
              {
                m: 0,
              },
          }}
        />
      </Paper>
    </Box>
  );
}

export default Reportcasetech;
