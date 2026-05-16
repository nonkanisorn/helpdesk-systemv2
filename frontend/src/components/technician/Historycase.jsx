import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Historycase() {
  const navigate = useNavigate();
  const technicianId = useSelector((state) => state.user.user_id);
  const token = useSelector((state) => state.user.token);
  const apiUrl = process.env.REACT_APP_API_URL;

  const [ticketData, setTicketData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const allowedStatus = [3, 4, 5, 6];

  const technicianStatusMap = {
    1: "เปิดงาน",
    2: "มอบหมายงาน",
    3: "กำลังดำเนินการ",
    4: "รอผู้ใช้ยืนยัน",
    5: "เสร็จสิ้น",
    6: "รออะไหล่",
  };

  const statusColorMap = {
    1: "default",
    2: "info",
    3: "warning",
    4: "secondary",
    5: "success",
    6: "warning",
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
      console.error("Error fetching technician history:", error);
    }
  };

  useEffect(() => {
    if (token && technicianId) {
      fetchTickets();
    }
  }, [token, technicianId]);

  const filteredTickets = useMemo(() => {
    return ticketData.filter((item) => {
      const keyword = searchText.trim().toLowerCase();
      const statusId = Number(item.status_id);

      const matchSearch =
        !keyword ||
        String(item.title ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.description ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(item.ticket_id ?? "")
          .toLowerCase()
          .includes(keyword);

      const matchStatus =
        statusFilter === "all"
          ? allowedStatus.includes(statusId)
          : statusId === Number(statusFilter);

      return matchSearch && matchStatus;
    });
  }, [ticketData, searchText, statusFilter]);

  const paginatedTickets = filteredTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const goDetail = (ticketId) => {
    navigate(`/technician/repairs/${ticketId}`);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
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
              ประวัติการซ่อม
            </Typography>

            <Typography variant="body2" color="text.secondary">
              รายการงานซ่อมที่กำลังดำเนินการ รอผู้ใช้ยืนยัน และปิดงาน
            </Typography>
          </Box>

          <Chip
            label={`${filteredTickets.length} รายการ`}
            variant="outlined"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          />
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(0);
            }}
            label="ค้นหา"
            placeholder="ค้นหาหัวข้อ รายละเอียด หรือรหัสงาน"
            fullWidth
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          <FormControl sx={{ minWidth: { xs: "100%", md: 240 } }}>
            <InputLabel>สถานะ</InputLabel>
            <Select
              value={statusFilter}
              label="สถานะ"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">ทั้งหมด</MenuItem>
              <MenuItem value="3">กำลังดำเนินการ</MenuItem>
              <MenuItem value="4">รอผู้ใช้ยืนยัน</MenuItem>
              <MenuItem value="5">เสร็จสิ้น</MenuItem>
              <MenuItem value="6">รออะไหล่</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <TableContainer
          sx={{
            display: { xs: "none", md: "block" },
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow>
                <TableCell>รหัสงาน</TableCell>
                <TableCell>หัวข้อ</TableCell>
                <TableCell>รายละเอียด</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell align="right">จัดการ</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedTickets.map((item) => {
                const statusId = Number(item.status_id);

                return (
                  <TableRow key={item.ticket_id} hover>
                    <TableCell>{item.ticket_id}</TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {item.title || "-"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 320,
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
                        label={technicianStatusMap[statusId] ?? "-"}
                        color={statusColorMap[statusId] ?? "default"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => goDetail(item.ticket_id)}
                      >
                        ดูรายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    ไม่พบข้อมูลการซ่อม
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
          {paginatedTickets.map((item) => {
            const statusId = Number(item.status_id);

            return (
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
                        หัวข้อ
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{
                          mt: 0.25,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.title || "-"}
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
                      รายละเอียด
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
                      label={technicianStatusMap[statusId] ?? "-"}
                      color={statusColorMap[statusId] ?? "default"}
                      size="small"
                      variant="outlined"
                      sx={{ width: "fit-content" }}
                    />
                  </Stack>

                  <Divider />

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => goDetail(item.ticket_id)}
                  >
                    ดูรายละเอียด
                  </Button>
                </Stack>
              </Paper>
            );
          })}

          {filteredTickets.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2.5,
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">ไม่พบข้อมูลการซ่อม</Typography>
            </Paper>
          )}
        </Stack>

        <TablePagination
          component="div"
          count={filteredTickets.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
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

export default Historycase;
