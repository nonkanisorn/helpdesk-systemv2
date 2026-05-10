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

function AddRoleDialog({ token, open, onClose, onSuccess }) {
  const [roleName, setRoleName] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const createRole = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${apiUrl}/roles`,
        { role_name: roleName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setRoleName("");
      onSuccess?.();
      onClose?.();

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setRoleName("");
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              เพิ่มบทบาท
            </Typography>
            <Typography variant="body2" color="text.secondary">
              เพิ่มบทบาทใหม่สำหรับกำหนดสิทธิ์ของผู้ใช้งาน
            </Typography>
          </Box>

          <Button onClick={handleClose} color="inherit">
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="add-role-form" onSubmit={createRole}>
          <TextField
            label="ชื่อบทบาท"
            id="role_name"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="เช่น Administrator"
            fullWidth
            autoFocus
            required
            helperText={!roleName.trim() ? "กรุณากรอกชื่อบทบาท" : " "}
            error={!roleName.trim()}
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
          onClick={handleClose}
          color="inherit"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          ยกเลิก
        </Button>

        <Button
          form="add-role-form"
          type="submit"
          variant="contained"
          disabled={!roleName.trim()}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          เพิ่มบทบาท
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddRoleDialog;
