import * as React from "react";
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
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  getPermissionDescription,
  getPermissionLabel,
} from "../../../../auth/permissionLabels";

function AddRoleDialog({ token, open, onClose, onSuccess }) {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [saving, setSaving] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!open || !token) return;

    const fetchPermissions = async () => {
      try {
        setLoadingPermissions(true);
        const response = await axios.get(`${apiUrl}/permissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPermissions(response.data.result ?? response.data ?? []);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, [apiUrl, open, token]);

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const createRole = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) return;

    try {
      setSaving(true);
      const response = await axios.post(
        `${apiUrl}/roles`,
        {
          role_name: roleName.trim(),
          permission_ids: selectedPermissionIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setRoleName("");
      setSelectedPermissionIds([]);
      onSuccess?.();
      onClose?.();

      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setRoleName("");
    setSelectedPermissionIds([]);
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              เพิ่มบทบาท
            </Typography>
            <Typography variant="body2" color="text.secondary">
              เพิ่มบทบาทใหม่สำหรับกำหนดสิทธิ์ของผู้ใช้งาน
            </Typography>
          </Box>

          <Button onClick={handleClose} color="inherit">
            ✕
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="add-role-form" onSubmit={createRole}>
          <Stack spacing={2.5}>
            <TextField
              label="ชื่อบทบาท"
              id="role_name"
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="เช่น Administrator"
              fullWidth
              autoFocus
              required
              helperText={!roleName.trim() ? "กรุณากรอกชื่อบทบาท" : " "}
              error={!roleName.trim()}
              disabled={saving}
            />

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>
                สิทธิ์ของบทบาท
              </Typography>

              {loadingPermissions ? (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    กำลังโหลดสิทธิ์...
                  </Typography>
                </Stack>
              ) : (
                <FormGroup>
                  {permissions.map((permission) => (
                    <FormControlLabel
                      key={permission.id}
                      control={
                        <Checkbox
                          checked={selectedPermissionIds.includes(
                            permission.id,
                          )}
                          onChange={() => handlePermissionChange(permission.id)}
                          disabled={saving}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {getPermissionLabel(permission.name)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getPermissionDescription(permission)}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </FormGroup>
              )}
            </Paper>
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
          disabled={saving}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          ยกเลิก
        </Button>

        <Button
          form="add-role-form"
          type="submit"
          variant="contained"
          disabled={!roleName.trim() || saving}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {saving ? "กำลังเพิ่ม..." : "เพิ่มบทบาท"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddRoleDialog;
