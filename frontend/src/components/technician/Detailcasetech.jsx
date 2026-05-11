import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { blue } from "@mui/material/colors";

function Detailcasetech() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const [ticketData, setTicketData] = useState(null);
  const [noSerial, setNoSerial] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusId = 4;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serial_number: "",
      resolution_note: "",
    },
  });

  useEffect(() => {
    if (noSerial) setValue("serial_number", "");
  }, [noSerial, setValue]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`${apiUrl}/ticket/${ticket_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(response.data)
        ? response.data[0]
        : (response.data.result ?? response.data);

      setTicketData(data ?? null);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    }
  };

  useEffect(() => {
    if (token && ticket_id) fetchTicket();
  }, [token, ticket_id]);

  const workComplete = async (data) => {
    if (!noSerial && !data.serial_number.trim()) {
      alert("กรุณาระบุรหัสอุปกรณ์ หรือเลือก 'ไม่ระบุรหัสอุปกรณ์'");
      return;
    }

    try {
      setLoading(true);

      await axios.patch(
        `${apiUrl}/technician/${ticket_id}/complete`,
        {
          status_id: statusId,
          serial_number: noSerial ? null : data.serial_number.trim(),
          resolution_note: data.resolution_note.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      navigate(-2);
    } catch (error) {
      console.error("Error completing repair:", error.response?.data || error);
      alert("กรุณาใส่รหัสอุปกรณ์ให้ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-2);
  };

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
            บันทึกการซ่อม
          </Typography>

          <Typography variant="body2" color="text.secondary">
            กรอกข้อมูลผลการซ่อมอุปกรณ์ให้ครบถ้วน
          </Typography>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2.5,
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <AssignmentIcon
                sx={{
                  fontSize: 44,
                  bgcolor: blue[600],
                  color: "white",
                  p: 1,
                  borderRadius: 2,
                }}
              />

              <Box>
                <Typography variant="h6" fontWeight={600}>
                  ฟอร์มบันทึกการซ่อม
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  กรุณาระบุรหัสอุปกรณ์และผลการซ่อม
                </Typography>
              </Box>
            </Stack>

            {ticketData && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  งานซ่อม
                </Typography>

                <Typography fontWeight={600} sx={{ wordBreak: "break-word" }}>
                  {ticketData.title ?? `Ticket #${ticket_id}`}
                </Typography>
              </Paper>
            )}

            <Box component="form" onSubmit={handleSubmit(workComplete)}>
              <Stack spacing={3}>
                <Box>
                  <TextField
                    label="รหัสอุปกรณ์"
                    placeholder="กรอกเฉพาะกรณีอุปกรณ์ Hardware"
                    fullWidth
                    disabled={noSerial || loading}
                    error={!noSerial && !!errors.serial_number}
                    helperText={
                      !noSerial && errors.serial_number
                        ? errors.serial_number.message
                        : " "
                    }
                    {...register("serial_number", {
                      validate: (value) =>
                        noSerial ||
                        !!value.trim() ||
                        "กรุณาระบุรหัสอุปกรณ์ หรือเลือกไม่ระบุรหัสอุปกรณ์",
                    })}
                  />

                  <FormControlLabel
                    sx={{ mt: 0.5 }}
                    control={
                      <Checkbox
                        checked={noSerial}
                        disabled={loading}
                        onChange={(e) => setNoSerial(e.target.checked)}
                      />
                    }
                    label="ไม่ระบุรหัสอุปกรณ์"
                  />
                </Box>

                <TextField
                  label="ผลการซ่อม"
                  placeholder="อธิบายวิธีแก้ไข อะไหล่ที่เปลี่ยน หรือหมายเหตุเพิ่มเติม"
                  multiline
                  minRows={6}
                  fullWidth
                  disabled={loading}
                  error={!!errors.resolution_note}
                  helperText={errors.resolution_note?.message || " "}
                  {...register("resolution_note", {
                    required: "กรุณาระบุผลการซ่อม",
                  })}
                />

                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  justifyContent="flex-end"
                  spacing={1}
                >
                  <Button
                    type="button"
                    color="inherit"
                    disabled={loading}
                    onClick={handleCancel}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    ยกเลิก
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    {loading ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={18} color="inherit" />
                        <span>กำลังบันทึก...</span>
                      </Stack>
                    ) : (
                      "ยืนยัน"
                    )}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Paper>
    </Box>
  );
}

export default Detailcasetech;
