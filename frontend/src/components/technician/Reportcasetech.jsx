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

  const assignedTickets = ticketData.filter(
    (item) => Number(item.status_id) === 2,
  );

  const paginatedTickets = assignedTickets.slice(
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
                <TableCell>ผู้แจ้ง</TableCell>
                <TableCell>รายละเอียดงาน</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell align="right">ดำเนินการ</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedTickets.map((item) => (
                <TableRow key={item.ticket_id} hover>
                  <TableCell>{item.ticket_id}</TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{item.title}</Typography>
                  </TableCell>

                  <TableCell>{item.usersname || "-"}</TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 280,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={
                        technicianStatusMap[item.status_id] ?? "ไม่ทราบสถานะ"
                      }
                      size="small"
                      {...statusChipProps(item.status_id)}
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
              ))}

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
          {paginatedTickets.map((item) => (
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
                      technicianStatusMap[item.status_id] ?? "ไม่ทราบสถานะ"
                    }
                    size="small"
                    sx={{ width: "fit-content" }}
                    {...statusChipProps(item.status_id)}
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
          ))}

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
