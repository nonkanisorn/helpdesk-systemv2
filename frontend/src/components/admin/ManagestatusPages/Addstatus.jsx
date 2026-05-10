import * as React from "react";
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

function Addstatus({ token, open, onClose, onSuccess }) {
  const [statusName, setStatusname] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const createstatus = async (e, event) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/status`,
        { status_name: statusName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setStatusname("");
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
              เพิ่มสถานะ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              เพิ่มสถานะใหม่สำหรับรายการแจ้งซ่อม
            </Typography>
          </Box>

          <Button onClick={onClose} color="inherit">
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="add-status-form" onSubmit={createstatus}>
          <TextField
            label="ชื่อสถานะ"
            id="status_name"
            type="text"
            value={statusName}
            onChange={(e) => setStatusname(e.target.value)}
            placeholder="เช่น กำลังดำเนินการ"
            fullWidth
            autoFocus
            required
            helperText={!statusName.trim() ? "กรุณากรอกชื่อสถานะ" : " "}
            error={!statusName.trim()}
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
          form="add-status-form"
          type="submit"
          variant="contained"
          disabled={!statusName.trim()}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          เพิ่มสถานะ
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Addstatus;
