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
import AddDepartmentDialog from "../dialog/AddDialog/AddDepartmentDialog";
import EditDepartmentDialog from "../dialog/EditDialog/EditDepartmentsDialog";
import { useSelector } from "react-redux";

function Managedepartment() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [departmentData, setDepartmentData] = useState([]);
  const [openAddDepartmentDialog, setOpenAddDepartmentDialog] = useState(false);
  const [openEditDepartmentDialog, setOpenEditDepartmentDialog] =
    useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`${apiUrl}/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDepartmentData(response.data.result ?? response.data ?? []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    if (token) fetchDepartment();
  }, [token]);

  const handleOpenEditDepartmentDialog = (department) => {
    setSelectedDepartment(department);
    setOpenEditDepartmentDialog(true);
  };

  const handleCloseEditDepartmentDialog = () => {
    setOpenEditDepartmentDialog(false);
    setSelectedDepartment(null);
  };

  const handleDeleteDepartment = async (depId) => {
    const shouldDelete = window.confirm("ต้องการลบแผนกนี้ใช่ไหม?");
    if (!shouldDelete) return;

    try {
      await axios.delete(`${apiUrl}/departments/${depId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchDepartment();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedDepartments = departmentData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <AddDepartmentDialog
        open={openAddDepartmentDialog}
        onClose={() => setOpenAddDepartmentDialog(false)}
        onSuccess={fetchDepartment}
        token={token}
      />

      <EditDepartmentDialog
        open={openEditDepartmentDialog}
        onClose={handleCloseEditDepartmentDialog}
        onSuccess={fetchDepartment}
        token={token}
        department={selectedDepartment}
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
                จัดการแผนก
              </Typography>

              <Typography variant="body2" color="text.secondary">
                เพิ่ม แก้ไข และลบแผนกในระบบ
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => setOpenAddDepartmentDialog(true)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              + เพิ่มแผนก
            </Button>
          </Stack>

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
                  <TableCell>ชื่อแผนก</TableCell>
                  <TableCell align="right">จัดการ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedDepartments.map((item) => (
                  <TableRow key={item.dep_id} hover>
                    <TableCell>{item.dep_id}</TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>{item.dep_name}</Typography>
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
                          onClick={() => handleOpenEditDepartmentDialog(item)}
                        >
                          แก้ไข
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteDepartment(item.dep_id)}
                        >
                          ลบ
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {departmentData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      ไม่พบข้อมูลแผนก
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
            {paginatedDepartments.map((item) => (
              <Paper
                key={item.dep_id}
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
                        ชื่อแผนก
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{
                          mt: 0.25,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.dep_name}
                      </Typography>
                    </Box>

                    <Chip
                      label={`ID: ${item.dep_id}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Divider />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleOpenEditDepartmentDialog(item)}
                    >
                      แก้ไข
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleDeleteDepartment(item.dep_id)}
                    >
                      ลบ
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {departmentData.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">ไม่พบข้อมูลแผนก</Typography>
              </Paper>
            )}
          </Stack>

          <TablePagination
            component="div"
            count={departmentData.length}
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

export default Managedepartment;
