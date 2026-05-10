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
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

function EditDeviceTypeDialog({ token, open, onClose, onSuccess, deviceType }) {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [deviceTypeName, setDeviceTypeName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && deviceType) {
      setDeviceTypeName(deviceType.devicetype_name ?? "");
    }
  }, [open, deviceType]);

  const updateDeviceTypeName = async (e) => {
    e.preventDefault();

    if (!deviceTypeName.trim() || !deviceType?.devicetype_id) return;

    try {
      setLoading(true);

      await axios.patch(
        `${apiUrl}/device-types/${deviceType.devicetype_id}`,
        { devicetype_name: deviceTypeName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !deviceTypeName.trim() ||
    deviceTypeName.trim() === deviceType?.devicetype_name;

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
              แก้ไขประเภทอุปกรณ์
            </Typography>

            <Typography variant="body2" color="text.secondary">
              เปลี่ยนชื่อประเภทอุปกรณ์ที่ใช้จัดกลุ่มอุปกรณ์ในระบบ
            </Typography>
          </Box>

          <Button onClick={onClose} color="inherit" disabled={loading}>
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          id="edit-device-type-form"
          onSubmit={updateDeviceTypeName}
        >
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
                ชื่อประเภทอุปกรณ์เดิม
              </Typography>

              <Typography variant="subtitle1" fontWeight={600}>
                {deviceType?.devicetype_name ?? "-"}
              </Typography>
            </Box>

            <TextField
              label="ชื่อประเภทอุปกรณ์ใหม่"
              value={deviceTypeName}
              onChange={(e) => setDeviceTypeName(e.target.value)}
              placeholder="เช่น คอมพิวเตอร์"
              fullWidth
              autoFocus
              required
              disabled={loading}
              error={!deviceTypeName.trim()}
              helperText={
                !deviceTypeName.trim() ? "กรุณากรอกชื่อประเภทอุปกรณ์" : " "
              }
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
          form="edit-device-type-form"
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

export default EditDeviceTypeDialog;
