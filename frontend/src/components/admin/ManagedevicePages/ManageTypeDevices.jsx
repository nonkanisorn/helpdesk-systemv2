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
import AddDeviceTypeDialog from "../dialog/AddDialog/AddDeviceTypeDialog";
import EditDeviceTypeDialog from "../dialog/EditDialog/EditDeviceTypeDialog";
import { useSelector } from "react-redux";

function ManageTypeDevices() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [typeDevice, setTypeDevice] = useState([]);
  const [openAddDeviceType, setOpenAddDeviceType] = useState(false);
  const [openEditDeviceTypeDialog, setOpenEditDeviceTypeDialog] =
    useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);

  const token = useSelector((state) => state.user.token);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchTypeDevice = async () => {
    try {
      const response = await axios.get(`${apiUrl}/device-types`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTypeDevice(
        response.data.data ?? response.data.result ?? response.data ?? [],
      );
    } catch (error) {
      console.error("Error fetching device types:", error);
    }
  };

  useEffect(() => {
    if (token) fetchTypeDevice();
  }, [token]);

  const handleOpenEditDeviceTypeDialog = (deviceType) => {
    setSelectedDeviceType(deviceType);
    setOpenEditDeviceTypeDialog(true);
  };

  const handleCloseEditDeviceTypeDialog = () => {
    setOpenEditDeviceTypeDialog(false);
    setSelectedDeviceType(null);
  };

  const handleDeleteDeviceType = async (deviceTypeId) => {
    const shouldDelete = window.confirm("ต้องการลบประเภทอุปกรณ์นี้ใช่ไหม?");
    if (!shouldDelete) return;

    try {
      await axios.delete(`${apiUrl}/device-types/${deviceTypeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTypeDevice();
    } catch (error) {
      console.error("Error deleting device type:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedDeviceTypes = typeDevice.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <AddDeviceTypeDialog
        open={openAddDeviceType}
        onClose={() => setOpenAddDeviceType(false)}
        onSuccess={fetchTypeDevice}
        token={token}
      />

      <EditDeviceTypeDialog
        open={openEditDeviceTypeDialog}
        onClose={handleCloseEditDeviceTypeDialog}
        onSuccess={fetchTypeDevice}
        token={token}
        deviceType={selectedDeviceType}
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
                จัดการประเภทอุปกรณ์
              </Typography>

              <Typography variant="body2" color="text.secondary">
                เพิ่ม แก้ไข และลบประเภทอุปกรณ์ในระบบ
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() => setOpenAddDeviceType(true)}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              + เพิ่มประเภทอุปกรณ์
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
                  <TableCell>ชื่อประเภทอุปกรณ์</TableCell>
                  <TableCell align="right">จัดการ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedDeviceTypes.map((item) => (
                  <TableRow key={item.devicetype_id} hover>
                    <TableCell>{item.devicetype_id}</TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {item.devicetype_name}
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
                          onClick={() => handleOpenEditDeviceTypeDialog(item)}
                        >
                          แก้ไข
                        </Button>

                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() =>
                            handleDeleteDeviceType(item.devicetype_id)
                          }
                        >
                          ลบ
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

                {typeDevice.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      ไม่พบข้อมูลประเภทอุปกรณ์
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
            {paginatedDeviceTypes.map((item) => (
              <Paper
                key={item.devicetype_id}
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
                        ชื่อประเภทอุปกรณ์
                      </Typography>

                      <Typography
                        fontWeight={600}
                        sx={{
                          mt: 0.25,
                          wordBreak: "break-word",
                        }}
                      >
                        {item.devicetype_name}
                      </Typography>
                    </Box>

                    <Chip
                      label={`ID: ${item.devicetype_id}`}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>

                  <Divider />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleOpenEditDeviceTypeDialog(item)}
                    >
                      แก้ไข
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleDeleteDeviceType(item.devicetype_id)}
                    >
                      ลบ
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}

            {typeDevice.length === 0 && (
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2.5,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  ไม่พบข้อมูลประเภทอุปกรณ์
                </Typography>
              </Paper>
            )}
          </Stack>

          <TablePagination
            component="div"
            count={typeDevice.length}
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

export default ManageTypeDevices;
