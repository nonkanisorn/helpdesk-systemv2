package service

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type PermissionService interface {
	GetAllPermissions() ([]domain.Permission, error)
	GetPermissionsByRoleID(roleID int) ([]domain.Permission, error)
	GetPermissionNamesByRoleID(roleID int) ([]string, error)
	GetPermissionsByUserID(userID int) ([]domain.Permission, error)
	GetPermissionNamesByUserID(userID int) ([]string, error)
	RoleHasPermission(roleID int, permissionName string) (bool, error)
	UserHasPermission(userID int, permissionName string) (bool, error)
	SetRolePermissions(roleID int, permissionIDs []int) error
	SetRolePermissionsByNames(roleID int, permissionNames []string) error
}
