import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";

function EditDeviceDialog({
  open,
  onClose,
  onSubmit,
  device,
  typeDevice,
  editDeviceName,
  setEditDeviceName,
  editDeviceType,
  setEditDeviceType,
  editDeviceDescription,
  setEditDeviceDescription,
}) {
  const [loading, setLoading] = useState(false);
  const deviceTypes = Array.isArray(typeDevice) ? typeDevice : [];

  const getTypeId = (item) =>
    item.devicetype_id ?? item.id ?? item.device_type_id;

  const getTypeName = (item) =>
    item.devicetype_name ?? item.name ?? item.device_type_name ?? "-";

  useEffect(() => {
    if (open && device) {
      setEditDeviceName(device.dev_name ?? "");
      setEditDeviceType(device.devicetype_id ?? device.dev_type ?? "");
      setEditDeviceDescription(device.dev_description ?? "");
    }
  }, [
    open,
    device,
    setEditDeviceName,
    setEditDeviceType,
    setEditDeviceDescription,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editDeviceName.trim() || !editDeviceType) return;

    try {
      setLoading(true);
      await onSubmit?.();
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !editDeviceName.trim() ||
    !editDeviceType ||
    (editDeviceName.trim() === device?.dev_name &&
      String(editDeviceType) ===
        String(device?.devicetype_id ?? device?.dev_type ?? "") &&
      editDeviceDescription.trim() === (device?.dev_description ?? ""));

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              แก้ไขอุปกรณ์
            </Typography>
            <Typography variant="body2" color="text.secondary">
              เปลี่ยนชื่อ ประเภท และรายละเอียดอุปกรณ์
            </Typography>
          </Box>

          <Button onClick={onClose} color="inherit" disabled={loading}>
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="edit-device-form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box
              sx={{
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                ข้อมูลอุปกรณ์เดิม
              </Typography>

              <Typography variant="subtitle1" fontWeight={600}>
                {device?.dev_name ?? "-"}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {device?.devicetype_name ?? "-"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, whiteSpace: "pre-line" }}
              >
                {device?.dev_description || "ไม่มีรายละเอียด"}
              </Typography>
            </Box>

            <TextField
              label="ชื่ออุปกรณ์ใหม่"
              value={editDeviceName}
              onChange={(e) => setEditDeviceName(e.target.value)}
              placeholder="เช่น คอมพิวเตอร์"
              fullWidth
              autoFocus
              required
              disabled={loading}
              error={!editDeviceName.trim()}
              helperText={!editDeviceName.trim() ? "กรุณากรอกชื่ออุปกรณ์" : " "}
            />

            <TextField
              select
              label="ประเภทอุปกรณ์"
              value={String(editDeviceType ?? "")}
              onChange={(e) => setEditDeviceType(e.target.value)}
              fullWidth
              required
              disabled={loading}
              error={!editDeviceType}
              helperText={!editDeviceType ? "กรุณาเลือกประเภทอุปกรณ์" : " "}
            >
              {deviceTypes.map((item) => {
                const typeId = getTypeId(item);

                return (
                  <MenuItem key={typeId} value={String(typeId)}>
                    {getTypeName(item)}
                  </MenuItem>
                );
              })}

              {deviceTypes.length === 0 && (
                <MenuItem disabled value="">
                  ไม่พบประเภทอุปกรณ์
                </MenuItem>
              )}
            </TextField>

            <TextField
              label="รายละเอียดอุปกรณ์"
              value={editDeviceDescription}
              onChange={(e) => setEditDeviceDescription(e.target.value)}
              placeholder="เช่น รุ่น สี สเปก หรือข้อมูลเพิ่มเติม"
              fullWidth
              multiline
              minRows={4}
              disabled={loading}
              helperText=" "
            />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          ยกเลิก
        </Button>

        <Button
          form="edit-device-form"
          type="submit"
          variant="contained"
          disabled={isDisabled}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} color="inherit" />
              <span>กำลังบันทึก...</span>
            </Stack>
          ) : (
            "บันทึกการแก้ไข"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditDeviceDialog;
