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

function Statuscase() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  const [ticketData, setTicketData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const allowedStatus = [2, 3, 4, 5, 6];

  const managerStatusMap = {
    2: "มอบหมายแล้ว",
    3: "อยู่ระหว่างดำเนินการ",
    4: "รอการยืนยันจากผู้ใช้",
    5: "เสร็จสิ้น",
    6: "รออะไหล่",
  };

  const statusColorMap = {
    2: "info",
    3: "warning",
    4: "primary",
    5: "success",
    6: "warning",
  };

  const getRequesterName = (item) => {
    const fullName = `${item.user_first_name ?? ""} ${
      item.user_last_name ?? ""
    }`.trim();

    return item.name || fullName || item.user_email || "-";
  };

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTicketData(response.data.result ?? response.data ?? []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    if (token) fetchTickets();
  }, [token]);

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
        String(item.name ?? "")
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

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("th-TH", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const goDetail = (ticketId) => {
    navigate(`/manager/ticketdetail/${ticketId}`);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              สถานะการซ่อม
            </Typography>

            <Typography variant="body2" color="text.secondary">
              ติดตามงานที่มอบหมายแล้ว กำลังดำเนินการ รอการยืนยัน เสร็จสิ้น
              และรออะไหล่
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
            placeholder="ค้นหาชื่องาน ผู้แจ้ง รายละเอียด หรือรหัสงาน"
            fullWidth
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          <FormControl sx={{ minWidth: { xs: "100%", md: 260 } }}>
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
              {allowedStatus.map((statusId) => (
                <MenuItem key={statusId} value={String(statusId)}>
                  {managerStatusMap[statusId]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <TableContainer
          sx={{
            display: { xs: "none", md: "block" },
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 950 }}>
            <TableHead>
              <TableRow>
                <TableCell>รหัสงาน</TableCell>
                <TableCell>ชื่องาน</TableCell>
                <TableCell>ผู้แจ้ง</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell>วันที่แจ้ง</TableCell>
                <TableCell align="right">รายละเอียด</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedTickets.map((item) => (
                <TableRow key={item.ticket_id} hover>
                  <TableCell>{item.ticket_id}</TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>
                      {item.title || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>{getRequesterName(item)}</TableCell>

                  <TableCell>
                    <Chip
                      label={managerStatusMap[item.status_id] ?? "ไม่ทราบสถานะ"}
                      color={statusColorMap[item.status_id] ?? "default"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>{formatDate(item.created_at)}</TableCell>

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
              ))}

              {filteredTickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    ไม่พบข้อมูลสถานะการซ่อม
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
          {paginatedTickets.map((item) => (
            <Paper
              key={item.ticket_id}
              variant="outlined"
              sx={{ p: 2, borderRadius: 2.5 }}
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
                      sx={{ mt: 0.25, wordBreak: "break-word" }}
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
                    ผู้แจ้ง
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {getRequesterName(item)}
                  </Typography>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    สถานะ
                  </Typography>
                  <Chip
                    label={managerStatusMap[item.status_id] ?? "ไม่ทราบสถานะ"}
                    color={statusColorMap[item.status_id] ?? "default"}
                    size="small"
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
                  variant="outlined"
                  fullWidth
                  onClick={() => goDetail(item.ticket_id)}
                >
                  ดูรายละเอียด
                </Button>
              </Stack>
            </Paper>
          ))}

          {filteredTickets.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2.5,
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">
                ไม่พบข้อมูลสถานะการซ่อม
              </Typography>
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

export default Statuscase;
