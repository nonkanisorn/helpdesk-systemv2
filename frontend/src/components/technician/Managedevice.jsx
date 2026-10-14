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
  TextField,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import AddDeviceDialog from "../shareDialog/AddDialog/AddDeviceDialog";
import EditDeviceDialog from "../shareDialog/EditDialog/EditDeviceDialog";
import {
  technicianPrimaryButtonSx,
  technicianSecondaryButtonSx,
} from "./buttonStyles";

const ManageDevice = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const [device, setDevice] = useState([]);
  const [typeDevice, setTypeDevice] = useState([]);
  const [deviceInstances, setDeviceInstances] = useState([]);
  const [serialSearch, setSerialSearch] = useState("");

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [selectedDevice, setSelectedDevice] = useState(null);

  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("");
  const [newDeviceDescription, setNewDeviceDescription] = useState("");

  const [editDeviceName, setEditDeviceName] = useState("");
  const [editDeviceType, setEditDeviceType] = useState("");
  const [editDeviceDescription, setEditDeviceDescription] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const normalizedSearch = serialSearch.trim().toLowerCase();
  const filteredDevices = device.filter((item) => {
    if (!normalizedSearch) return true;
    return deviceInstances.some(
      (instance) =>
        Number(instance.device_id ?? instance.dev_id) === Number(item.dev_id) &&
        String(instance.serial_number ?? "").toLowerCase().includes(normalizedSearch),
    );
  });
  const paginatedDevice = filteredDevices.slice(
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

  const normalizeDevices = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : (payload?.data ?? payload?.result ?? []);

    return list.map((item) => ({
      ...item,
      dev_id: item.dev_id ?? item.id,
      dev_name: item.dev_name ?? item.name,
      dev_type: item.dev_type ?? item.device_type_id,
      dev_description: item.dev_description ?? item.description ?? "",
      numberofinstancedevice:
        item.numberofinstancedevice ??
        item.number_of_instance_device ??
        item.instance_count ??
        item.device_count ??
        0,
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
    setDevice(normalizeDevices(res.data));
  };

  const fetchDeviceTypes = async () => {
    const res = await axios.get(`${apiUrl}/device-types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTypeDevice(normalizeDeviceTypes(res.data));
  };

  const fetchDeviceInstances = async () => {
    const res = await axios.get(`${apiUrl}/device-instances`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const list = res.data?.result ?? res.data?.data ?? res.data ?? [];
    setDeviceInstances(Array.isArray(list) ? list : []);
  };

  useEffect(() => {
    if (token) {
      fetchDevices();
      fetchDeviceTypes();
      fetchDeviceInstances();
    }
  }, [token]);

  const handleAddDevice = async () => {
    if (!newDeviceName.trim() || !newDeviceType) return;

    try {
      await axios.post(
        `${apiUrl}/devices`,
        {
          dev_name: newDeviceName.trim(),
          name: newDeviceName.trim(),
          dev_type: Number(newDeviceType),
          device_type_id: Number(newDeviceType),
          dev_description: newDeviceDescription.trim(),
          description: newDeviceDescription.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setOpenAddDialog(false);
      setNewDeviceName("");
      setNewDeviceType("");
      setNewDeviceDescription("");
      setPage(0);
      fetchDevices();
    } catch (error) {
      console.error("Error adding device:", error);
    }
  };

  const handleOpenEditDialog = (item) => {
    setSelectedDevice({
      ...item,
      devicetype_name: item.devicetype_name ?? getDeviceTypeName(item.dev_type),
    });
    setEditDeviceName(item.dev_name ?? "");
    setEditDeviceType(item.dev_type ?? "");
    setEditDeviceDescription(item.dev_description ?? "");
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedDevice(null);
    setEditDeviceName("");
    setEditDeviceType("");
    setEditDeviceDescription("");
  };

  const handleEditDevice = async () => {
    if (!editDeviceName.trim()) return;

    await axios.put(
      `${apiUrl}/devices/${selectedDevice.dev_id}`,
      {
        dev_name: editDeviceName.trim(),
        name: editDeviceName.trim(),
        newdevicename: editDeviceName.trim(),
        dev_type: Number(editDeviceType),
        device_type_id: Number(editDeviceType),
        dev_description: editDeviceDescription.trim(),
        description: editDeviceDescription.trim(),
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    handleCloseEditDialog();
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

          <Button
            variant="contained"
            onClick={() => setOpenAddDialog(true)}
            sx={technicianPrimaryButtonSx}
          >
            + เพิ่มอุปกรณ์
          </Button>
        </Stack>

        <TextField
          fullWidth
          size="small"
          label="ค้นหาด้วย Serial Number"
          placeholder="กรอก Serial Number เพื่อค้นหาอุปกรณ์"
          value={serialSearch}
          onChange={(event) => {
            setSerialSearch(event.target.value);
            setPage(0);
          }}
          sx={{ mb: 2 }}
        />

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
                        sx={technicianSecondaryButtonSx}
                      >
                        แก้ไข
                      </Button>

                      <Button
                        component={Link}
                        to={`detail/${item.dev_id}`}
                        variant="outlined"
                        size="small"
                        sx={technicianSecondaryButtonSx}
                      >
                        รายการ
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDevices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {normalizedSearch ? "ไม่พบอุปกรณ์ที่ตรงกับ Serial Number" : "ยังไม่มีข้อมูลอุปกรณ์"}
                  </TableCell>
                </TableRow>
              )}
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
                    sx={technicianSecondaryButtonSx}
                  >
                    แก้ไข
                  </Button>

                  <Button
                    component={Link}
                    to={`detail/${item.dev_id}`}
                    variant="outlined"
                    fullWidth
                    sx={technicianSecondaryButtonSx}
                  >
                    รายการอุปกรณ์
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          ))}
          {filteredDevices.length === 0 && (
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2.5 }}>
              <Typography color="text.secondary">
                {normalizedSearch ? "ไม่พบอุปกรณ์ที่ตรงกับ Serial Number" : "ยังไม่มีข้อมูลอุปกรณ์"}
              </Typography>
            </Paper>
          )}
        </Stack>

        <TablePagination
          component="div"
          count={filteredDevices.length}
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
        device={selectedDevice}
        typeDevice={typeDevice}
        editDeviceName={editDeviceName}
        setEditDeviceName={setEditDeviceName}
        editDeviceType={editDeviceType}
        setEditDeviceType={setEditDeviceType}
        editDeviceDescription={editDeviceDescription}
        setEditDeviceDescription={setEditDeviceDescription}
      />
    </Box>
  );
};

export default ManageDevice;
