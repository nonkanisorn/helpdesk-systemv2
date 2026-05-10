import React, { useEffect, useState } from "react";
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

function EditRoleDialog({ token, open, onClose, onSuccess, role }) {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (open && role) {
      setRoleName(role.role_name || "");
    }
  }, [open, role]);

  const handleClose = () => {
    setRoleName(role?.role_name || "");
    onClose?.();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!roleName.trim() || !role?.role_id) return;

    try {
      setLoading(true);

      await axios.patch(
        `${apiUrl}/roles/${role.role_id}`,
        { role_name: roleName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              แก้ไขบทบาท
            </Typography>
            <Typography variant="body2" color="text.secondary">
              แก้ไขชื่อบทบาทสำหรับกำหนดสิทธิ์ของผู้ใช้งาน
            </Typography>
          </Box>

          <Button onClick={handleClose} color="inherit" disabled={loading}>
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="edit-role-form" onSubmit={handleUpdate}>
          <Stack spacing={2.5}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                ชื่อบทบาทเดิม
              </Typography>
              <Typography fontWeight={600}>{role?.role_name || "-"}</Typography>
            </Box>

            <TextField
              label="ชื่อบทบาทใหม่"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="เช่น Administrator"
              fullWidth
              autoFocus
              required
              error={!roleName.trim()}
              helperText={!roleName.trim() ? "กรุณากรอกชื่อบทบาท" : " "}
              disabled={loading}
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
          onClick={handleClose}
          color="inherit"
          disabled={loading}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          ยกเลิก
        </Button>

        <Button
          form="edit-role-form"
          type="submit"
          variant="contained"
          disabled={
            !roleName.trim() || roleName.trim() === role?.role_name || loading
          }
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRoleDialog;
