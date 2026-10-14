import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
  Autocomplete,
  Chip,
  Divider,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import { blue } from "@mui/material/colors";
import {
  technicianNeutralButtonSx,
  technicianPrimaryButtonSx,
} from "./buttonStyles";

function Detailcasetech() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const [ticketData, setTicketData] = useState(null);
  const [noSerial, setNoSerial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceInstances, setDeviceInstances] = useState([]);
  const [deviceLoading, setDeviceLoading] = useState(false);

  const statusId = 4;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serial_number: "",
      resolution_note: "",
    },
  });

  const watchedSerial = watch("serial_number") || "";

  useEffect(() => {
    if (noSerial) setValue("serial_number", "");
  }, [noSerial, setValue]);

  const fetchDeviceInstances = async () => {
    try {
      setDeviceLoading(true);
      const res = await axios.get(`${apiUrl}/device-instances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data?.result ?? res.data?.data ?? res.data ?? [];
      setDeviceInstances(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching device instances:", error);
    } finally {
      setDeviceLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDeviceInstances();
  }, [token]);

  const matchedDevice = useMemo(() => {
    if (noSerial || !watchedSerial.trim()) return null;
    const cleanSerial = watchedSerial.trim().toLowerCase();
    return (
      deviceInstances.find(
        (item) =>
          (item.serial_number || "").trim().toLowerCase() === cleanSerial
      ) || null
    );
  }, [noSerial, watchedSerial, deviceInstances]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tickets/${ticket_id}`, {
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
      alert(
        error.response?.data?.error ||
          "บันทึกผลการซ่อมไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      );
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
                  <Controller
                    name="serial_number"
                    control={control}
                    rules={{
                      validate: (value) =>
                        noSerial ||
                        !!(value && value.trim()) ||
                        "กรุณาระบุรหัสอุปกรณ์ หรือเลือกไม่ระบุรหัสอุปกรณ์",
                    }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <Autocomplete
                        freeSolo
                        disabled={noSerial || loading}
                        options={deviceInstances}
                        loading={deviceLoading}
                        getOptionLabel={(option) => {
                          if (typeof option === "string") return option;
                          return option?.serial_number || "";
                        }}
                        isOptionEqualToValue={(option, val) => {
                          const optStr =
                            typeof option === "string"
                              ? option
                              : option?.serial_number || "";
                          const valStr =
                            typeof val === "string"
                              ? val
                              : val?.serial_number || "";
                          return (
                            optStr.trim().toLowerCase() ===
                            valStr.trim().toLowerCase()
                          );
                        }}
                        filterOptions={(options, state) => {
                          const q = (state.inputValue || "").trim().toLowerCase();
                          if (!q) return options;
                          return options.filter((item) => {
                            const sn = (item.serial_number || "").toLowerCase();
                            const dn = (item.device_name || "").toLowerCase();
                            const dt = (item.device_type_name || "").toLowerCase();
                            const dep = (item.department_name || "").toLowerCase();
                            return (
                              sn.includes(q) ||
                              dn.includes(q) ||
                              dt.includes(q) ||
                              dep.includes(q)
                            );
                          });
                        }}
                        value={value || ""}
                        onInputChange={(event, newInputValue) => {
                          onChange(newInputValue);
                        }}
                        onChange={(event, newValue) => {
                          if (typeof newValue === "string") {
                            onChange(newValue);
                          } else if (newValue?.serial_number) {
                            onChange(newValue.serial_number);
                          } else {
                            onChange("");
                          }
                        }}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            key={option.id ?? option.serial_number}
                            sx={{ py: 1 }}
                          >
                            <Stack spacing={0.25} sx={{ width: "100%" }}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={1}
                              >
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  color="primary.main"
                                >
                                  {option.serial_number}
                                </Typography>
                                {option.department_name && (
                                  <Chip
                                    label={option.department_name}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: "0.72rem" }}
                                  />
                                )}
                              </Stack>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {[option.device_name, option.device_type_name]
                                  .filter(Boolean)
                                  .join(" • ") || "ไม่ระบุชื่ออุปกรณ์"}
                              </Typography>
                            </Stack>
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="รหัสอุปกรณ์"
                            placeholder="พิมพ์ค้นหาหรือเลือกจากรายการ (เช่น SSN-0021)"
                            fullWidth
                            error={!noSerial && !!error}
                            helperText={
                              !noSerial && error
                                ? error.message
                                : !noSerial && watchedSerial.trim() && !matchedDevice
                                ? "⚠️ ไม่พบรหัสอุปกรณ์นี้ในระบบ กรุณาตรวจสอบรหัสอีกครั้ง"
                                : " "
                            }
                            FormHelperTextProps={{
                              sx: {
                                color:
                                  !noSerial &&
                                  !error &&
                                  watchedSerial.trim() &&
                                  !matchedDevice
                                    ? "warning.main"
                                    : undefined,
                              },
                            }}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {deviceLoading ? (
                                    <CircularProgress color="inherit" size={18} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                  />

                  {matchedDevice && !noSerial && (
                    <Paper
                      variant="outlined"
                      sx={{
                        mt: 1.5,
                        p: 2,
                        borderRadius: 2.5,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(25, 118, 210, 0.08)"
                            : "rgba(240, 247, 255, 0.9)",
                        borderColor: "primary.light",
                        boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={1}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CheckCircleOutlineRoundedIcon
                              color="success"
                              sx={{ fontSize: 22 }}
                            />
                            <Typography
                              variant="subtitle2"
                              fontWeight={700}
                              color="success.dark"
                            >
                              พบข้อมูลอุปกรณ์ในระบบ
                            </Typography>
                          </Stack>

                          <Chip
                            label="ตรงกับในระบบ"
                            color="success"
                            size="small"
                            variant="filled"
                            sx={{
                              height: 22,
                              fontSize: "0.72rem",
                              fontWeight: 600,
                            }}
                          />
                        </Stack>

                        <Divider
                          sx={{ my: 0.5, borderColor: "rgba(25, 118, 210, 0.15)" }}
                        />

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              sm: "repeat(2, 1fr)",
                            },
                            gap: 1.5,
                          }}
                        >
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              ชื่ออุปกรณ์ / รุ่น
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="text.primary"
                            >
                              {matchedDevice.device_name || "ไม่ระบุชื่ออุปกรณ์"}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              ประเภทอุปกรณ์
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="text.primary"
                            >
                              {matchedDevice.device_type_name || "ไม่ระบุประเภท"}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              รหัสอุปกรณ์ (Serial Number)
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="primary.main"
                            >
                              {matchedDevice.serial_number}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              แผนกที่สังกัด / ติดตั้ง
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="text.primary"
                            >
                              {matchedDevice.department_name || "ไม่ระบุแผนก"}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", pt: 0.5 }}
                        >
                          💡 ข้อมูลแสดงเพื่อการตรวจสอบเทียบกับอุปกรณ์จริง ไม่จำเป็นต้องกดยืนยันเพิ่มเติม
                        </Typography>
                      </Stack>
                    </Paper>
                  )}

                  <FormControlLabel
                    sx={{ mt: 1 }}
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
                    startIcon={<CloseRoundedIcon />}
                    disabled={loading}
                    onClick={handleCancel}
                    sx={{
                      ...technicianNeutralButtonSx,
                      width: { xs: "100%", sm: "auto" },
                      py: 1.1,
                    }}
                  >
                    ยกเลิก
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={!loading && <CheckRoundedIcon />}
                    disabled={loading}
                    sx={{
                      ...technicianPrimaryButtonSx,
                      width: { xs: "100%", sm: "auto" },
                      py: 1.1,
                    }}
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
