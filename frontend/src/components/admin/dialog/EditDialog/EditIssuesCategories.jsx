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

function EditIssuesCategoriesDialog({
  token,
  open,
  onClose,
  onSuccess,
  issueCategory,
}) {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [issuesName, setIssuesName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && issueCategory) {
      setIssuesName(issueCategory.issues_name ?? "");
    }
  }, [open, issueCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!issuesName.trim() || !issueCategory?.issues_id) return;

    try {
      setLoading(true);

      await axios.patch(
        `${apiUrl}/issues-categories/${issueCategory.issues_id}`,
        { issues_name: issuesName.trim() },
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
    !issuesName.trim() ||
    issuesName.trim() === issueCategory?.issues_name;

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
              แก้ไขประเภทปัญหา
            </Typography>

            <Typography variant="body2" color="text.secondary">
              เปลี่ยนชื่อประเภทปัญหาที่ใช้ในระบบแจ้งซ่อม
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
          id="edit-issues-categories-form"
          onSubmit={handleSubmit}
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
                ชื่อประเภทปัญหาเดิม
              </Typography>

              <Typography variant="subtitle1" fontWeight={600}>
                {issueCategory?.issues_name ?? "-"}
              </Typography>
            </Box>

            <TextField
              label="ชื่อประเภทปัญหาใหม่"
              value={issuesName}
              onChange={(e) => setIssuesName(e.target.value)}
              placeholder="เช่น เครื่องเปิดไม่ติด"
              fullWidth
              autoFocus
              required
              disabled={loading}
              error={!issuesName.trim()}
              helperText={!issuesName.trim() ? "กรุณากรอกชื่อประเภทปัญหา" : " "}
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
          form="edit-issues-categories-form"
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

export default EditIssuesCategoriesDialog;
