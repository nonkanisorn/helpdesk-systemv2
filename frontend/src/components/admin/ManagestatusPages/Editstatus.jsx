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

function Editstatus({ token, open, onClose, onSuccess, status }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && status) {
      setNewName(status.status_name ?? "");
    }
  }, [open, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newName.trim()) return;

    try {
      setLoading(true);

      await axios.patch(
        `${apiUrl}/status/${status.status_id}`,
        {
          status_name: newName.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || !newName.trim() || newName.trim() === status?.status_name;

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
              แก้ไขสถานะ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              เปลี่ยนชื่อสถานะที่ใช้ในระบบแจ้งซ่อม
            </Typography>
          </Box>

          <Button onClick={onClose} color="inherit" disabled={loading}>
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="edit-status-form" onSubmit={handleSubmit}>
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
                ชื่อสถานะเดิม
              </Typography>

              <Typography variant="subtitle1" fontWeight={600}>
                {status?.status_name ?? "-"}
              </Typography>
            </Box>

            <TextField
              label="ชื่อสถานะใหม่"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              autoFocus
              required
              disabled={loading}
              error={!newName.trim()}
              helperText={!newName.trim() ? "กรุณากรอกชื่อสถานะ" : " "}
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
          form="edit-status-form"
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

export default Editstatus;
