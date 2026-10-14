import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  technicianNeutralButtonSx,
  technicianPrimaryButtonSx,
} from "../technician/buttonStyles";

function Addcase() {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [ticketDetail, setTicketDetail] = useState("");
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const statusId = 1;

  const userId = useSelector((state) => state.user.user_id);
  const token = useSelector((state) => state.user.token);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/issue-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(
        response.data.data ?? response.data.result ?? response.data ?? [],
      );
    } catch (error) {
      console.error("Error fetching issue categories:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  const createTicket = async (e) => {
    e.preventDefault();

    if (!title.trim() || !ticketDetail.trim() || !selectCategory) return;

    try {
      setLoading(true);

      await axios.post(
        `${apiUrl}/tickets`,
        {
          title: title.trim(),
          description: ticketDetail.trim(),
          user_id: userId,
          status_id: statusId,
          issue_categories_id: Number(selectCategory),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTitle("");
      setTicketDetail("");
      setSelectCategory("");
      setNotification({
        open: true,
        severity: "success",
        message: "แจ้งสำเร็จแล้ว",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      setNotification({
        open: true,
        severity: "error",
        message: "แจ้งไม่สำเร็จ",
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || !title.trim() || !ticketDetail.trim() || !selectCategory;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
        }}
      >
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            แจ้งซ่อม
          </Typography>

          <Typography variant="body2" color="text.secondary">
            กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความรวดเร็วในการดำเนินการ
          </Typography>
        </Stack>

        <Box component="form" onSubmit={createTicket}>
          <Stack spacing={3}>
            <TextField
              label="หัวข้อการแจ้งซ่อม"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น คอมพิวเตอร์เปิดไม่ติด"
              fullWidth
              required
              disabled={loading}
              error={!title.trim()}
              helperText={!title.trim() ? "กรุณากรอกหัวข้อการแจ้งซ่อม" : " "}
            />

            <TextField
              label="รายละเอียดปัญหา"
              value={ticketDetail}
              onChange={(e) => setTicketDetail(e.target.value)}
              placeholder="อธิบายอาการ ปัญหา หรือรายละเอียดเพิ่มเติม"
              multiline
              minRows={4}
              fullWidth
              required
              disabled={loading}
              error={!ticketDetail.trim()}
              helperText={
                !ticketDetail.trim() ? "กรุณากรอกรายละเอียดปัญหา" : " "
              }
            />

            <TextField
              select
              label="หมวดหมู่ปัญหา"
              value={selectCategory ?? ""}
              onChange={(e) => setSelectCategory(e.target.value)}
              fullWidth
              required
              disabled={loading}
              error={!selectCategory}
              helperText={!selectCategory ? "กรุณาเลือกหมวดหมู่ปัญหา" : " "}
              SelectProps={{
                onOpen: fetchCategories,
              }}
            >
              {categories.map((item) => {
                const categoryId = item.issues_categories_id ?? item.issues_id;
                const categoryName = item.issues_name ?? item.name;

                return (
                  <MenuItem key={categoryId} value={String(categoryId)}>
                    {categoryName}
                  </MenuItem>
                );
              })}
            </TextField>

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              justifyContent="flex-end"
              spacing={1}
            >
              <Button
                type="button"
                color="inherit"
                disabled={loading}
                onClick={() => {
                  setTitle("");
                  setTicketDetail("");
                  setSelectCategory("");
                }}
                sx={{
                  ...technicianNeutralButtonSx,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                ล้างข้อมูล
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={isDisabled}
                sx={{
                  ...technicianPrimaryButtonSx,
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {loading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} color="inherit" />
                    <span>กำลังบันทึก...</span>
                  </Stack>
                ) : (
                  "เพิ่มการแจ้งซ่อม"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() =>
            setNotification((prev) => ({ ...prev, open: false }))
          }
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Addcase;
