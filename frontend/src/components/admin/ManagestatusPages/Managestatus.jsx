import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  TablePagination,
  Divider,
  Chip,
} from "@mui/material";

import Addstatus from "./Addstatus.jsx";
import Editstatus from "./Editstatus.jsx";
import { useSelector } from "react-redux";
import AddStatusDialog from "../dialog/AddDialog/AddStatusDialog.jsx";

function Managestatus() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [statusData, setStatusData] = useState([]);
  const token = useSelector((state) => state.user.token);

  const [openAddStatusDialog, setOpenAddStatusDialog] = useState(false);
  const [openEditStatusDialog, setOpenEditStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatusData(res.data.result ?? res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenEdit = (status) => {
    setSelectedStatus(status);
    setOpenEditStatusDialog(true);
  };

  const handleCloseEdit = () => {
    setOpenEditStatusDialog(false);
    setSelectedStatus(null);
  };

  const handleDelete = async (statusId) => {
    const confirmDelete = window.confirm("ต้องการลบสถานะนี้ใช่ไหม?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiUrl}/status/${statusId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedStatusData = statusData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <AddStatusDialog
        open={openAddStatusDialog}
        onClose={() => setOpenAddStatusDialog(false)}
        onSuccess={fetchData}
        token={token}
      />

      <Editstatus
        open={openEditStatusDialog}
        onClose={handleCloseEdit}
        onSuccess={fetchData}
        status={selectedStatus}
        token={token}
      />

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
                จัดการสถานะ
              </Typography>

              <Typography variant="body2" color="text.secondary">
                เพิ่ม แก้ไข และลบสถานะของรายการแจ้งซ่อม
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => setOpenAddStatusDialog(true)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              + เพิ่มสถานะ
            </Button>
          </Stack>

          {/* Desktop / Tablet Table */}
          <TableContainer
            sx={{
              display: { xs: "none", md: "block" },
              overflowX: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ชื่อสถานะ</TableCell>
                  <TableCell align="right">จัดการ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedStatusData.map((item) => (
                  <TableRow key={item.status_id} hover>
                    <TableCell>{item.status_id}</TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {item.status_name}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenEdit(item)}
                        >
                          แก้ไข
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(item.status_id)}
                        >
                          ลบ
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {statusData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      ไม่พบข้อมูลสถานะ
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Mobile Card */}
          <Stack
            spacing={1.5}
            sx={{
              display: { xs: "flex", md: "none" },
            }}
          >
            {paginatedStatusData.map((item) => (
              <Paper
                key={item.status_id}
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
                        ชื่อสถานะ
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{
                          mt: 0.25,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.status_name}
                      </Typography>
                    </Box>

                    <Chip
                      label={`ID: ${item.status_id}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Divider />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleOpenEdit(item)}
                    >
                      แก้ไข
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleDelete(item.status_id)}
                    >
                      ลบ
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {statusData.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">ไม่พบข้อมูลสถานะ</Typography>
              </Paper>
            )}
          </Stack>

          <TablePagination
            component="div"
            count={statusData.length}
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
    </>
  );
}

export default Managestatus;
