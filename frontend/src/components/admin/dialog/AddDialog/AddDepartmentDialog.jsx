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

function AddDepartmentDialog({ token, open, onClose, onSuccess }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [departmentName, setDepartmentName] = useState("");

  const createDepartment = async (e) => {
    e.preventDefault();

    if (!departmentName.trim()) return;

    try {
      const response = await axios.post(
        `${apiUrl}/departments`,
        { dep_name: departmentName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setDepartmentName("");
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
              เพิ่มแผนก
            </Typography>

            <Typography variant="body2" color="text.secondary">
              เพิ่มแผนกใหม่สำหรับจัดกลุ่มผู้ใช้งานในองค์กร
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
          id="create-department-form"
          onSubmit={createDepartment}
        >
          <TextField
            label="ชื่อแผนก"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="เช่น ฝ่ายไอที"
            fullWidth
            autoFocus
            required
            helperText={!departmentName.trim() ? "กรุณากรอกชื่อแผนก" : " "}
            error={!departmentName.trim()}
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
          form="create-department-form"
          type="submit"
          variant="contained"
          disabled={!departmentName.trim()}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          เพิ่มแผนก
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddDepartmentDialog;
