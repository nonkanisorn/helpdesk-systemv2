package domain

type CreateRolesRequest struct {
	RoleName      string   `json:"role_name"`
	PermissionIDs []int    `json:"permission_ids"`
	Permissions   []string `json:"permissions"`
}
