import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";

const EditUserDialog = ({
  id,
  open,
  onClose,
  onSuccess,
  roleData,
  depData,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = useSelector((state) => state.user.token);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      role_id: null,
      department_id: null,
      is_active: 1,
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !id) return;

    const fetchUser = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${apiUrl}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = res.data.result ?? res.data;

        reset({
          username: u.username ?? "",
          password: "",
          first_name: u.first_name ?? "",
          last_name: u.last_name ?? "",
          email: u.email ?? "",
          phone: u.phone ?? "",
          role_id: u.role_id ?? null,
          department_id: u.department_id ?? u.dep_id ?? null,
          is_active: typeof u.is_active === "number" ? u.is_active : 1,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [open, id, apiUrl, token, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        role_id: Number(data.role_id),
        department_id: Number(data.department_id),
        is_active: Number(data.is_active),
      };

      if (data.password?.trim()) {
        payload.password = data.password;
      }

      await axios.patch(`${apiUrl}/users/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      onClose?.();
      onSuccess?.();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              แก้ไขผู้ใช้
            </Typography>
            <Typography variant="body2" color="text.secondary">
              แก้ไขข้อมูลผู้ใช้งาน บทบาท แผนก และสถานะ
            </Typography>
          </Box>

          <Button onClick={onClose} color="inherit">
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              กำลังโหลดข้อมูลผู้ใช้...
            </Typography>
          </Stack>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} id="edit-user-form">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
                pt: 1,
              }}
            >
              <TextField
                label="ชื่อผู้ใช้"
                fullWidth
                {...register("username")}
              />

              <TextField label="อีเมล์" fullWidth {...register("email")} />

              <TextField
                label="รหัสผ่านใหม่"
                type="password"
                fullWidth
                helperText="เว้นว่างไว้ หากไม่ต้องการเปลี่ยนรหัสผ่าน"
                {...register("password")}
              />

              <TextField
                label="เบอร์โทรศัพท์"
                fullWidth
                {...register("phone")}
              />

              <TextField label="ชื่อ" fullWidth {...register("first_name")} />

              <TextField label="นามสกุล" fullWidth {...register("last_name")} />

              <Controller
                control={control}
                name="role_id"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>บทบาท</InputLabel>
                    <Select
                      {...field}
                      label="บทบาท"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      {(roleData ?? []).map((r) => (
                        <MenuItem key={r.role_id} value={r.role_id}>
                          {r.role_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="department_id"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>แผนก</InputLabel>
                    <Select
                      {...field}
                      label="แผนก"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      {(depData ?? []).map((d) => (
                        <MenuItem key={d.dep_id} value={d.dep_id}>
                          {d.dep_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>สถานะผู้ใช้งาน</InputLabel>
                    <Select
                      {...field}
                      label="สถานะผู้ใช้งาน"
                      value={field.value ?? 1}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    >
                      <MenuItem value={1}>พร้อมใช้งาน</MenuItem>
                      <MenuItem value={0}>ไม่พร้อมใช้งาน</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </form>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          ยกเลิก
        </Button>

        <Button
          form="edit-user-form"
          type="submit"
          variant="contained"
          disabled={loading || isSubmitting}
        >
          {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
