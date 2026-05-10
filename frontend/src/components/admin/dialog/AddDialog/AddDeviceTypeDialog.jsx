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
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

function AddDeviceTypeDialog({ token, open, onClose, onSuccess }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [deviceTypeName, setDeviceTypeName] = useState("");

  const createDeviceType = async (e) => {
    e.preventDefault();

    if (!deviceTypeName.trim()) return;

    try {
      const response = await axios.post(
        `${apiUrl}/device-types`,
        { devicetype_name: deviceTypeName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setDeviceTypeName("");
      onSuccess?.();
      onClose?.();

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              เพิ่มประเภทอุปกรณ์
            </Typography>

            <Typography variant="body2" color="text.secondary">
              เพิ่มประเภทอุปกรณ์ใหม่สำหรับใช้จัดกลุ่มอุปกรณ์ในระบบ
            </Typography>
          </Box>

          <Button onClick={onClose} color="inherit">
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          id="create-device-type-form"
          onSubmit={createDeviceType}
        >
          <TextField
            label="ชื่อประเภทอุปกรณ์"
            value={deviceTypeName}
            onChange={(e) => setDeviceTypeName(e.target.value)}
            placeholder="เช่น คอมพิวเตอร์"
            fullWidth
            autoFocus
            required
            helperText={
              !deviceTypeName.trim() ? "กรุณากรอกชื่อประเภทอุปกรณ์" : " "
            }
            error={!deviceTypeName.trim()}
          />
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
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          ยกเลิก
        </Button>

        <Button
          form="create-device-type-form"
          type="submit"
          variant="contained"
          disabled={!deviceTypeName.trim()}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          เพิ่มประเภทอุปกรณ์
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddDeviceTypeDialog;
