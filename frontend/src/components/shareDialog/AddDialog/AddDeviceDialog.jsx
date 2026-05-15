import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";

const AddDeviceDialog = ({
  open,
  onClose,
  onSubmit,
  typeDevice,
  newDeviceName,
  setNewDeviceName,
  newDeviceType,
  setNewDeviceType,
  newDeviceDescription,
  setNewDeviceDescription,
}) => {
  const deviceTypes = Array.isArray(typeDevice) ? typeDevice : [];

  const getTypeId = (item) =>
    item.devicetype_id ?? item.id ?? item.device_type_id;

  const getTypeName = (item) =>
    item.devicetype_name ?? item.name ?? item.device_type_name ?? "-";

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
              เพิ่มอุปกรณ์
            </Typography>
            <Typography variant="body2" color="text.secondary">
              กรอกข้อมูลอุปกรณ์ใหม่
            </Typography>
          </Box>

          <Button onClick={onClose} color="inherit">
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="ชื่ออุปกรณ์"
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
            fullWidth
            required
            autoFocus
            error={!newDeviceName.trim()}
            helperText={!newDeviceName.trim() ? "กรุณากรอกชื่ออุปกรณ์" : " "}
          />

          <TextField
            select
            label="ประเภทอุปกรณ์"
            value={String(newDeviceType ?? "")}
            onChange={(e) => setNewDeviceType(e.target.value)}
            fullWidth
            required
            error={!newDeviceType}
            helperText={!newDeviceType ? "กรุณาเลือกประเภทอุปกรณ์" : " "}
          >
            {deviceTypes.map((item) => {
              const typeId = getTypeId(item);

              return (
                <MenuItem key={typeId} value={String(typeId)}>
                  {getTypeName(item)}
                </MenuItem>
              );
            })}

            {deviceTypes.length === 0 && (
              <MenuItem disabled value="">
                ไม่พบประเภทอุปกรณ์
              </MenuItem>
            )}
          </TextField>

          <TextField
            label="รายละเอียดอุปกรณ์"
            value={newDeviceDescription}
            onChange={(e) => setNewDeviceDescription(e.target.value)}
            placeholder="เช่น รุ่น สี สเปก หรือข้อมูลเพิ่มเติม"
            fullWidth
            multiline
            minRows={4}
            helperText=" "
          />
        </Stack>
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
          variant="contained"
          onClick={onSubmit}
          disabled={!newDeviceName.trim() || !newDeviceType}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          เพิ่มอุปกรณ์
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDeviceDialog;
