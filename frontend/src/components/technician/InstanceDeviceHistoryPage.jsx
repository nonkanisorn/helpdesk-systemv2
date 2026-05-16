import {
  Box,
  Paper,
  Typography,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Divider,
  TablePagination,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const InstanceDeviceHistoryPage = () => {
  const { instance_id } = useParams();

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const [historyData, setHistoryData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const statusMap = {
    1: { label: "เปิดงาน", color: "default" },
    2: { label: "ได้รับมอบหมาย", color: "warning" },
    3: { label: "กำลังดำเนินการ", color: "info" },
    4: { label: "รอผู้ใช้ยืนยัน", color: "info" },
    5: { label: "เสร็จสิ้น", color: "success" },
    6: { label: "รออะไหล่", color: "warning" },
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/device-instances/history-repair/${instance_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setHistoryData(response.data.data ?? response.data.result ?? []);
    } catch (error) {
      console.error("Error fetching device instance history:", error);
    }
  };

  useEffect(() => {
    if (token && instance_id) fetchHistory();
  }, [token, instance_id]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleString("th-TH", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const latestRepair = useMemo(() => {
    if (historyData.length === 0) return null;

    return [...historyData].sort(
      (a, b) =>
        new Date(b.closed_at ?? b.completed_at ?? b.created_at) -
        new Date(a.closed_at ?? a.completed_at ?? a.created_at),
    )[0];
  }, [historyData]);

  const paginatedHistory = historyData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5" fontWeight={600}>
              ประวัติการซ่อม
            </Typography>

            <Typography variant="body2" color="text.secondary">
              ประวัติการซ่อมทั้งหมดของรายการอุปกรณ์นี้
            </Typography>
          </Stack>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
            ข้อมูลรายการอุปกรณ์
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
          >
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Instance ID
              </Typography>
              <Typography fontWeight={600}>{instance_id}</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                จำนวนครั้งที่ซ่อม
              </Typography>
              <Typography fontWeight={600}>{historyData.length}</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                การซ่อมล่าสุด
              </Typography>
              <Typography fontWeight={600}>
                {formatDateTime(
                  latestRepair?.closed_at ??
                    latestRepair?.completed_at ??
                    latestRepair?.created_at,
                )}
              </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                สถานะล่าสุด
              </Typography>

              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={
                    latestRepair
                      ? (statusMap[latestRepair.status_id]?.label ??
                        `สถานะ ${latestRepair.status_id}`)
                      : "-"
                  }
                  color={
                    latestRepair
                      ? (statusMap[latestRepair.status_id]?.color ?? "default")
                      : "default"
                  }
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Paper>
          </Stack>
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
                ประวัติการซ่อมทั้งหมด
              </Typography>

              <Typography variant="body2" color="text.secondary">
                รายการงานซ่อมที่เคยเกี่ยวข้องกับอุปกรณ์นี้
              </Typography>
            </Box>

            <Chip
              label={`${historyData.length} รายการ`}
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
                  <TableCell>รหัสงาน</TableCell>
                  <TableCell>ปัญหา</TableCell>
                  <TableCell>รายละเอียด</TableCell>
                  <TableCell>วันที่แจ้ง</TableCell>
                  <TableCell>เสร็จสิ้นเมื่อ</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell align="right">จัดการ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedHistory.map((item) => (
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

                    <TableCell>{formatDateTime(item.created_at)}</TableCell>

                    <TableCell>
                      {formatDateTime(item.completed_at ?? item.closed_at)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          statusMap[item.status_id]?.label ??
                          `สถานะ ${item.status_id}`
                        }
                        color={statusMap[item.status_id]?.color ?? "default"}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        component={Link}
                        to={`/technician/repairs/${item.ticket_id}`}
                        variant="outlined"
                        size="small"
                      >
                        ดูรายละเอียด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {historyData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      ไม่พบประวัติการซ่อมของอุปกรณ์
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
            {paginatedHistory.map((item) => (
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
                        ปัญหา
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
                      label={`Ticket: ${item.ticket_id}`}
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
                      วันที่แจ้ง
                    </Typography>

                    <Typography variant="body2" fontWeight={500}>
                      {formatDateTime(item.created_at)}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      เสร็จสิ้นเมื่อ
                    </Typography>

                    <Typography variant="body2" fontWeight={500}>
                      {formatDateTime(item.completed_at ?? item.closed_at)}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">
                      สถานะ
                    </Typography>

                    <Chip
                      label={
                        statusMap[item.status_id]?.label ??
                        `สถานะ ${item.status_id}`
                      }
                      color={statusMap[item.status_id]?.color ?? "default"}
                      size="small"
                      variant="outlined"
                      sx={{ width: "fit-content" }}
                    />
                  </Stack>

                  <Divider />

                  <Button
                    component={Link}
                    to={`/technician/repairs/${item.ticket_id}`}
                    variant="outlined"
                    fullWidth
                  >
                    ดูรายละเอียด
                  </Button>
                </Stack>
              </Paper>
            ))}

            {historyData.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  ไม่พบประวัติการซ่อมของอุปกรณ์
                </Typography>
              </Paper>
            )}
          </Stack>

          <TablePagination
            component="div"
            count={historyData.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
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
      </Stack>
    </Box>
  );
};

export default InstanceDeviceHistoryPage;
