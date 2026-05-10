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

function AddIssuesCategoriesDialog({ token, open, onClose, onSuccess }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [issuesName, setIssuesName] = useState("");

  const createIssuesCategory = async (e) => {
    e.preventDefault();

    if (!issuesName.trim()) return;

    try {
      const response = await axios.post(
        `${apiUrl}/issues-categories`,
        { issues_name: issuesName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setIssuesName("");
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
              เพิ่มประเภทปัญหา
            </Typography>

            <Typography variant="body2" color="text.secondary">
              เพิ่มประเภทปัญหาใหม่สำหรับใช้จัดกลุ่มรายการแจ้งซ่อม
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
          id="create-issues-categories-form"
          onSubmit={createIssuesCategory}
        >
          <TextField
            label="ชื่อประเภทปัญหา"
            value={issuesName}
            onChange={(e) => setIssuesName(e.target.value)}
            placeholder="เช่น เครื่องเปิดไม่ติด"
            fullWidth
            autoFocus
            required
            helperText={!issuesName.trim() ? "กรุณากรอกชื่อประเภทปัญหา" : " "}
            error={!issuesName.trim()}
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
          form="create-issues-categories-form"
          type="submit"
          variant="contained"
          disabled={!issuesName.trim()}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          เพิ่มประเภทปัญหา
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddIssuesCategoriesDialog;
