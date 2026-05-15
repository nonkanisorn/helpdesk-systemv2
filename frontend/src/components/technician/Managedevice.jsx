import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Divider,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import AddDeviceDialog from "../shareDialog/AddDialog/AddDeviceDialog";
import EditDeviceDialog from "../shareDialog/EditDialog/EditDeviceDialog";

const ManageDevice = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const [device, setDevice] = useState([]);
  const [typeDevice, setTypeDevice] = useState([]);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState(null);

  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("");
  const [newDeviceDescription, setNewDeviceDescription] = useState("");

  const [editDeviceName, setEditDeviceName] = useState("");
  const [editDeviceType, setEditDeviceType] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedDevice = device.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const normalizeDeviceTypes = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : (payload?.data ?? payload?.result ?? []);

    return list.map((item) => ({
      ...item,
      devicetype_id: item.devicetype_id ?? item.id ?? item.device_type_id,
      devicetype_name:
        item.devicetype_name ?? item.name ?? item.device_type_name,
    }));
  };

  const getDeviceTypeName = (typeId) => {
    const found = typeDevice.find(
      (t) => Number(t.devicetype_id) === Number(typeId),
    );
    return found?.devicetype_name ?? "-";
  };

  const fetchDevices = async () => {
    const res = await axios.get(`${apiUrl}/devices`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDevice(res.data.result ?? res.data ?? []);
  };

  const fetchDeviceTypes = async () => {
    const res = await axios.get(`${apiUrl}/device-types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTypeDevice(normalizeDeviceTypes(res.data));
  };

  useEffect(() => {
    if (token) {
      fetchDevices();
      fetchDeviceTypes();
    }
  }, [token]);

  const handleAddDevice = async () => {
    if (!newDeviceName.trim() || !newDeviceType) return;

    await axios.post(
      `${apiUrl}/devices`,
      {
        dev_name: newDeviceName.trim(),
        dev_type: Number(newDeviceType),
        dev_description: newDeviceDescription.trim(),
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    setOpenAddDialog(false);
    setNewDeviceName("");
    setNewDeviceType("");
    setNewDeviceDescription("");
    fetchDevices();
  };

  const handleOpenEditDialog = (item) => {
    setSelectedDevice(item);
    setEditDeviceName(item.dev_name ?? "");
    setEditDeviceType(item.dev_type ?? "");
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedDevice(null);
  };

  const handleEditDevice = async () => {
    if (!editDeviceName.trim()) return;

    await axios.put(
      `${apiUrl}/devices/${selectedDevice.dev_id}`,
      {
        newdevicename: editDeviceName.trim(),
        dev_type: Number(editDeviceType),
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    handleCloseEditDialog();
    fetchDevices();
  };

  const handleDeleteDevice = async (id) => {
    if (!window.confirm("ลบจริง?")) return;

    await axios.delete(`${apiUrl}/devices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchDevices();
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        {/* HEADER */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              จัดการอุปกรณ์
            </Typography>
            <Typography color="text.secondary">
              เพิ่ม / แก้ไข / ลบ อุปกรณ์
            </Typography>
          </Box>

          <Button variant="contained" onClick={() => setOpenAddDialog(true)}>
            + เพิ่มอุปกรณ์
          </Button>
        </Stack>

        {/* DESKTOP TABLE */}
        <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ชื่อ</TableCell>
                <TableCell>ประเภท</TableCell>
                <TableCell align="center">จำนวน</TableCell>
                <TableCell align="right">จัดการ</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedDevice.map((item) => (
                <TableRow key={item.dev_id}>
                  <TableCell>{item.dev_id}</TableCell>

                  <TableCell>
                    <Typography fontWeight={500}>{item.dev_name}</Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getDeviceTypeName(item.dev_type)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={item.numberofinstancedevice ?? 0}
                      size="small"
                      color="info"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenEditDialog(item)}
                      >
                        แก้ไข
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteDevice(item.dev_id)}
                      >
                        ลบ
                      </Button>

                      <Button
                        component={Link}
                        to={`detail/${item.dev_id}`}
                        variant="outlined"
                        size="small"
                      >
                        รายการ
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ MOBILE (FIX แล้ว มีปุ่มรายการ) */}
        <Stack sx={{ display: { xs: "flex", md: "none" } }} spacing={2}>
          {paginatedDevice.map((item) => (
            <Paper key={item.dev_id} sx={{ p: 2, borderRadius: 2.5 }}>
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      ชื่ออุปกรณ์
                    </Typography>
                    <Typography fontWeight={600}>{item.dev_name}</Typography>
                  </Box>

                  <Chip label={`ID: ${item.dev_id}`} size="small" />
                </Stack>

                <Chip label={getDeviceTypeName(item.dev_type)} size="small" />

                <Divider />

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleOpenEditDialog(item)}
                  >
                    แก้ไข
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => handleDeleteDevice(item.dev_id)}
                  >
                    ลบ
                  </Button>
                </Stack>

                {/* ✅ FIX: ปุ่มรายการ */}
                <Button
                  component={Link}
                  to={`detail/${item.dev_id}`}
                  variant="outlined"
                  fullWidth
                >
                  รายการอุปกรณ์
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <TablePagination
          component="div"
          count={device.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
        />
      </Paper>

      {/* ADD */}
      <AddDeviceDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddDevice}
        typeDevice={typeDevice}
        newDeviceName={newDeviceName}
        setNewDeviceName={setNewDeviceName}
        newDeviceType={newDeviceType}
        setNewDeviceType={setNewDeviceType}
        newDeviceDescription={newDeviceDescription}
        setNewDeviceDescription={setNewDeviceDescription}
      />

      {/* EDIT */}
      <EditDeviceDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditDevice}
        typeDevice={typeDevice}
        editDeviceName={editDeviceName}
        setEditDeviceName={setEditDeviceName}
        editDeviceType={editDeviceType}
        setEditDeviceType={setEditDeviceType}
      />
    </Box>
  );
};

export default ManageDevice;
