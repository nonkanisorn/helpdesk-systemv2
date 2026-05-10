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

function EditDepartmentDialog({ token, open, onClose, onSuccess, department }) {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && department) {
      setDepartmentName(department.dep_name ?? "");
    }
  }, [open, department]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departmentName.trim() || !department?.dep_id) return;

    try {
      setLoading(true);

      await axios.patch(
        `${apiUrl}/departments/${department.dep_id}`,
        { dep_name: departmentName.trim() },
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
      console.error("Error updating department:", error);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !departmentName.trim() ||
    departmentName.trim() === department?.dep_name;

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
              แก้ไขแผนก
            </Typography>

            <Typography variant="body2" color="text.secondary">
              เปลี่ยนชื่อแผนกที่ใช้สำหรับจัดกลุ่มผู้ใช้งานในองค์กร
            </Typography>
          </Box>

          <Button onClick={onClose} color="inherit" disabled={loading}>
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="edit-department-form" onSubmit={handleSubmit}>
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
                ชื่อแผนกเดิม
              </Typography>

              <Typography variant="subtitle1" fontWeight={600}>
                {department?.dep_name ?? "-"}
              </Typography>
            </Box>

            <TextField
              label="ชื่อแผนกใหม่"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="เช่น ฝ่ายไอที"
              fullWidth
              autoFocus
              required
              disabled={loading}
              error={!departmentName.trim()}
              helperText={!departmentName.trim() ? "กรุณากรอกชื่อแผนก" : " "}
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
          form="edit-department-form"
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

export default EditDepartmentDialog;
