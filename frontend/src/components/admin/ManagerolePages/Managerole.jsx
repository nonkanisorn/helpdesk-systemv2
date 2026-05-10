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
import AddRoleDialog from "../dialog/AddDialog/AddRoleDialog";
import EditRoleDialog from "../dialog/EditDialog/EditRoleDialog";
import { useSelector } from "react-redux";

function Managerole() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [roles, setRoles] = useState([]);
  const token = useSelector((state) => state.user.token);

  const [openAddRoleDialog, setOpenAddRoleDialog] = useState(false);
  const [openEditRoleDialog, setOpenEditRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${apiUrl}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRoles(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    if (token) fetchRoles();
  }, [token]);

  const handleOpenEditRoleDialog = (role) => {
    setSelectedRole(role);
    setOpenEditRoleDialog(true);
  };

  const handleCloseEditRoleDialog = () => {
    setOpenEditRoleDialog(false);
    setSelectedRole(null);
  };

  const handleDelete = async (roleId) => {
    const confirmDelete = window.confirm("ต้องการลบบทบาทนี้ใช่ไหม?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiUrl}/roles/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRoles = roles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <AddRoleDialog
        token={token}
        open={openAddRoleDialog}
        onClose={() => setOpenAddRoleDialog(false)}
        onSuccess={fetchRoles}
      />

      <EditRoleDialog
        token={token}
        open={openEditRoleDialog}
        onClose={handleCloseEditRoleDialog}
        onSuccess={fetchRoles}
        role={selectedRole}
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
                จัดการบทบาท
              </Typography>

              <Typography variant="body2" color="text.secondary">
                เพิ่ม แก้ไข และลบบทบาทของผู้ใช้งานในระบบ
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => setOpenAddRoleDialog(true)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              + เพิ่มบทบาท
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
                  <TableCell>ชื่อบทบาท</TableCell>
                  <TableCell align="right">จัดการ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRoles.map((role) => (
                  <TableRow key={role.role_id} hover>
                    <TableCell>{role.role_id}</TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>{role.role_name}</Typography>
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
                          onClick={() => handleOpenEditRoleDialog(role)}
                        >
                          แก้ไข
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(role.role_id)}
                        >
                          ลบ
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {roles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      ไม่พบข้อมูลบทบาท
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
            {paginatedRoles.map((role) => (
              <Paper
                key={role.role_id}
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
                        ชื่อบทบาท
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{
                          mt: 0.25,
                          wordBreak: "break-word",
                        }}
                      >
                        {role.role_name}
                      </Typography>
                    </Box>

                    <Chip
                      label={`ID: ${role.role_id}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Divider />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleOpenEditRoleDialog(role)}
                    >
                      แก้ไข
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleDelete(role.role_id)}
                    >
                      ลบ
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {roles.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">ไม่พบข้อมูลบทบาท</Typography>
              </Paper>
            )}
          </Stack>

          <TablePagination
            component="div"
            count={roles.length}
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

export default Managerole;
