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
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Paper,
} from "@mui/material";
import axios from "axios";
import {
  getPermissionDescription,
  getPermissionLabel,
} from "../../../../auth/permissionLabels";

function EditRoleDialog({ token, open, onClose, onSuccess, role }) {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (open && role) {
      setRoleName(role.role_name || "");
    }
  }, [open, role]);

  useEffect(() => {
    if (!open || !role?.role_id || !token) return;

    const fetchPermissions = async () => {
      try {
        setLoadingPermissions(true);
        const [allPermissionsResponse, rolePermissionsResponse] =
          await Promise.all([
            axios.get(`${apiUrl}/permissions`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${apiUrl}/roles/${role.role_id}/permissions`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const allPermissions =
          allPermissionsResponse.data.result ?? allPermissionsResponse.data ?? [];
        const rolePermissions =
          rolePermissionsResponse.data.result ??
          rolePermissionsResponse.data ??
          [];

        setPermissions(allPermissions);
        setSelectedPermissionIds(
          rolePermissions.map((permission) => permission.id),
        );
      } catch (error) {
        console.error("Error fetching role permissions:", error);
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, [apiUrl, open, role, token]);

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

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
                          disabled={loading}
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
          disabled={loading}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          ยกเลิก
        </Button>

        <Button
          form="edit-role-form"
          type="submit"
          variant="contained"
          disabled={!roleName.trim() || loading}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRoleDialog;
