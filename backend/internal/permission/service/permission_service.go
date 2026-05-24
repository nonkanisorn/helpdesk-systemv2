package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"github.com/nonkanisorn/helpdesk-system/internal/permission/repository"
)

type permissionService struct {
	permissionRepo repository.PermissionRepository
}

func NewPermissionService(permissionRepo repository.PermissionRepository) PermissionService {
	return permissionService{permissionRepo: permissionRepo}
}

func rowsToPermissions(rows []repository.PermissionRow) []domain.Permission {
	permissions := []domain.Permission{}
	for _, row := range rows {
		permissions = append(permissions, domain.Permission{
			ID:          row.ID,
			Name:        row.Name,
			Description: row.Description,
		})
	}

	return permissions
}

func permissionNames(permissions []domain.Permission) []string {
	names := []string{}
	for _, permission := range permissions {
		names = append(names, permission.Name)
	}

	return names
}

func (p permissionService) GetAllPermissions() ([]domain.Permission, error) {
	rows, err := p.permissionRepo.GetAllPermissions()
	if err != nil {
		return nil, err
	}

	return rowsToPermissions(rows), nil
}

func (p permissionService) GetPermissionsByRoleID(roleID int) ([]domain.Permission, error) {
	rows, err := p.permissionRepo.GetPermissionsByRoleID(roleID)
	if err != nil {
		return nil, err
	}

	return rowsToPermissions(rows), nil
}

func (p permissionService) GetPermissionNamesByRoleID(roleID int) ([]string, error) {
	permissions, err := p.GetPermissionsByRoleID(roleID)
	if err != nil {
		return nil, err
	}

	return permissionNames(permissions), nil
}

func (p permissionService) GetPermissionsByUserID(userID int) ([]domain.Permission, error) {
	rows, err := p.permissionRepo.GetPermissionsByUserID(userID)
	if err != nil {
		return nil, err
	}

	return rowsToPermissions(rows), nil
}

func (p permissionService) GetPermissionNamesByUserID(userID int) ([]string, error) {
	permissions, err := p.GetPermissionsByUserID(userID)
	if err != nil {
		return nil, err
	}

	return permissionNames(permissions), nil
}

func (p permissionService) RoleHasPermission(roleID int, permissionName string) (bool, error) {
	return p.permissionRepo.RoleHasPermission(roleID, permissionName)
}

func (p permissionService) UserHasPermission(userID int, permissionName string) (bool, error) {
	permissions, err := p.GetPermissionsByUserID(userID)
	if err != nil {
		return false, err
	}

	for _, permission := range permissions {
		if permission.Name == permissionName {
			return true, nil
		}
	}

	return false, nil
}

func (p permissionService) SetRolePermissions(roleID int, permissionIDs []int) error {
	return p.permissionRepo.SetRolePermissions(roleID, permissionIDs)
}

func (p permissionService) SetRolePermissionsByNames(roleID int, permissionNames []string) error {
	permissionIDs, err := p.permissionRepo.GetPermissionIDsByNames(permissionNames)
	if err != nil {
		return err
	}

	return p.SetRolePermissions(roleID, permissionIDs)
}
