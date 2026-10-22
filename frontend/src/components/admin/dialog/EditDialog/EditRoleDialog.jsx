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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import {
  getPermissionDescription,
  getPermissionLabel,
  permissionGroups,
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

  const categorizedNames = new Set(
    permissionGroups.flatMap((group) => group.permissionNames),
  );
  const uncategorizedPermissions = permissions.filter(
    (p) => !categorizedNames.has(p.name),
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              แก้ไขบทบาท
            </Typography>
            <Typography variant="body2" color="text.secondary">
              แก้ไขข้อมูลบทบาทสำหรับกำหนดสิทธิ์ของผู้ใช้งาน
            </Typography>
          </Box>

          <IconButton
            onClick={handleClose}
            size="small"
            color="inherit"
            disabled={loading}
            sx={{ mt: -0.5, mr: -0.5, color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1 }}>
        <Box component="form" id="edit-role-form" onSubmit={handleUpdate}>
          <Stack spacing={2}>
            <TextField
              label="ชื่อบทบาท"
              id="edit_role_name"
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="เช่น Administrator"
              fullWidth
              autoFocus
              required
              helperText={!roleName.trim() ? "กรุณากรอกชื่อบทบาท" : " "}
              error={!roleName.trim()}
              disabled={loading}
            />

            <Box>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ mb: 1, color: "text.primary" }}
              >
                สิทธิ์ของบทบาท
              </Typography>

              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 2,
                  maxHeight: 330,
                  overflowY: "auto",
                }}
              >
                {loadingPermissions ? (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{ py: 3 }}
                  >
                    <CircularProgress size={20} />
                    <Typography variant="body2" color="text.secondary">
                      กำลังโหลดสิทธิ์...
                    </Typography>
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    {permissionGroups.map((group, groupIndex) => {
                      const groupPermissions = permissions.filter((p) =>
                        group.permissionNames.includes(p.name),
                      );
                      if (groupPermissions.length === 0) return null;

                      return (
                        <Box
                          key={group.key}
                          sx={{
                            mt: groupIndex > 0 ? 1.5 : 0,
                            pt: groupIndex > 0 ? 1.5 : 0,
                            borderTop: groupIndex > 0 ? "1px solid" : "none",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              fontWeight: 700,
                              color: "text.secondary",
                              letterSpacing: "0.25px",
                              mb: 1,
                            }}
                          >
                            {group.title}
                          </Typography>

                          <FormGroup>
                            {groupPermissions.map((permission) => (
                              <FormControlLabel
                                key={permission.id}
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={selectedPermissionIds.includes(
                                      permission.id,
                                    )}
                                    onChange={() =>
                                      handlePermissionChange(permission.id)
                                    }
                                    disabled={loading}
                                    sx={{ mt: -1.2 }}
                                  />
                                }
                                label={
                                  <Box sx={{ mb: 1 }}>
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                      color="text.primary"
                                    >
                                      {getPermissionLabel(permission.name)}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      {getPermissionDescription(permission)}
                                    </Typography>
                                  </Box>
                                }
                                sx={{
                                  alignItems: "flex-start",
                                  m: 0,
                                  mb: 0.5,
                                }}
                              />
                            ))}
                          </FormGroup>
                        </Box>
                      );
                    })}

                    {uncategorizedPermissions.length > 0 && (
                      <Box
                        sx={{
                          pt: 1.5,
                          borderTop: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            fontWeight: 700,
                            color: "text.secondary",
                            letterSpacing: "0.25px",
                            mb: 1,
                          }}
                        >
                          สิทธิ์อื่นๆ
                        </Typography>

                        <FormGroup>
                          {uncategorizedPermissions.map((permission) => (
                            <FormControlLabel
                              key={permission.id}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={selectedPermissionIds.includes(
                                    permission.id,
                                  )}
                                  onChange={() =>
                                    handlePermissionChange(permission.id)
                                  }
                                  disabled={loading}
                                  sx={{ mt: -1.2 }}
                                />
                              }
                              label={
                                <Box sx={{ mb: 1 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="text.primary"
                                  >
                                    {getPermissionLabel(permission.name)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                  >
                                    {getPermissionDescription(permission)}
                                  </Typography>
                                </Box>
                              }
                              sx={{
                                alignItems: "flex-start",
                                m: 0,
                                mb: 0.5,
                              }}
                            />
                          ))}
                        </FormGroup>
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          color="inherit"
          disabled={loading}
        >
          ยกเลิก
        </Button>

        <Button
          form="edit-role-form"
          type="submit"
          variant="contained"
          disabled={!roleName.trim() || loading}
        >
          {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRoleDialog;
