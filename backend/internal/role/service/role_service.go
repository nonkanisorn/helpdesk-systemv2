package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/role/repository"
)

type roleService struct {
	roleRepo repository.RoleRepository
}

func NewRoleService(roleRepo repository.RoleRepository) roleService {
	return roleService{roleRepo: roleRepo}
}

func (r roleService) GetRole() ([]Role, error) {
	roles, err := r.roleRepo.GetAll()
	if err != nil {
		return nil, err
	}
	// fmt.Println(roles)
	rolesResponses := []Role{}
	for _, role := range roles {
		rolesResponse := Role{
			RoleID:   role.RoleID,
			RoleName: role.RoleName,
		}
		rolesResponses = append(rolesResponses, rolesResponse)
	}
	return rolesResponses, nil
}

func (r roleService) GetRoleByID(id int) (*Role, error) {
	role, err := r.roleRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return &Role{
		RoleID:   role.RoleID,
		RoleName: role.RoleName,
	}, nil
}

func (r roleService) CreateRoles(roleName string) (int, error) {
	roleID, err := r.roleRepo.Create(roleName)
	if err != nil {
		return 0, err
	}
	return roleID, nil
}

func (r roleService) UpdateRoleByID(id int, roleName string) error {
	err := r.roleRepo.UpdateByID(id, roleName)
	if err != nil {
		return err
	}
	return nil
}

func (r roleService) DeleteRolesByID(id int) error {
	err := r.roleRepo.DeleteByID(id)
	if err != nil {
		return err
	}
	return nil
}
