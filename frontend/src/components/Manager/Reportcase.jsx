import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import { useSelector } from "react-redux";

function Reportcase() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const token = useSelector((state) => state.user.token);

  const [ticketData, setTicketData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const statusId = 1;

  const managerStatusMap = {
    1: "รอมอบหมาย",
    2: "มอบหมายแล้ว",
    3: "อยู่ระหว่างดำเนินการ",
    4: "รอการยืนยันจากผู้ใช้",
    5: "เสร็จสิ้น",
    6: "รออะไหล่",
  };

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tickets/status/${statusId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTicketData(response.data.result ?? response.data ?? []);
    } catch (error) {
      console.error("Error fetching report tickets:", error);
    }
  };

  useEffect(() => {
    if (token) fetchTickets();
  }, [token]);

  const handleOpenAssign = (ticketId) => {
    navigate(`/manager/ticket/assign/${ticketId}`);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("th-TH", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTickets = ticketData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

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
              รายการแจ้งซ่อม
            </Typography>

            <Typography variant="body2" color="text.secondary">
              รายการที่รอมอบหมายช่างให้รับผิดชอบ
            </Typography>
          </Box>

          <Chip
            label={`${ticketData.length} รายการ`}
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
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ชื่องาน</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>วันที่แจ้ง</TableCell>
                <TableCell align="right">จัดการ</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedTickets.map((item) => (
                <TableRow key={item.ticket_id} hover>
                  <TableCell>{item.ticket_id}</TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{item.title}</Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={managerStatusMap[item.status_id] ?? "ไม่ทราบสถานะ"}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>{formatDate(item.created_at)}</TableCell>

                  <TableCell align="right">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenAssign(item.ticket_id)}
                    >
                      มอบหมายช่าง
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {ticketData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    ไม่พบรายการแจ้งซ่อมที่รอมอบหมาย
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
                    label={`ID: ${item.ticket_id}`}
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    สถานะ
                  </Typography>

                  <Chip
                    label={managerStatusMap[item.status_id] ?? "ไม่ทราบสถานะ"}
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ width: "fit-content" }}
                  />
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    วันที่แจ้ง
                  </Typography>

                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(item.created_at)}
                  </Typography>
                </Stack>

                <Divider />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleOpenAssign(item.ticket_id)}
                >
                  มอบหมายช่าง
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
                ไม่พบรายการแจ้งซ่อมที่รอมอบหมาย
              </Typography>
            </Paper>
          )}
        </Stack>

        <TablePagination
          component="div"
          count={ticketData.length}
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

export default Reportcase;
