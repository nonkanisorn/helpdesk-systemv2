package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/department/repository"
)

type departmentService struct {
	depRepo repository.DepartmentRepository
}

func NewDepartmentService(depRepo repository.DepartmentRepository) departmentService {
	return departmentService{depRepo: depRepo}
}

func (d departmentService) GetAllDepartments() ([]DepartmentResponse, error) {
	departments, err := d.depRepo.GetAll()
	if err != nil {
		return nil, err
	}
	departmentResponses := []DepartmentResponse{}
	for _, department := range departments {
		departmentRes := DepartmentResponse{
			DepartmentID:   department.DepartmentID,
			DepartmentName: department.DepartmentName,
		}
		departmentResponses = append(departmentResponses, departmentRes)
	}
	return departmentResponses, nil
}

func (d departmentService) GetDepartmentByID(id int) (*DepartmentResponse, error) {
	department, err := d.depRepo.GetByID(id)
	if err != nil {
		return nil, err
	}
	return &DepartmentResponse{
		DepartmentID:   department.DepartmentID,
		DepartmentName: department.DepartmentName,
	}, nil
}

func (d departmentService) CreateDepartments(departmentName string) error {
	err := d.depRepo.Create(departmentName)
	if err != nil {
		return err
	}
	return nil
}

func (d departmentService) DeleteDepartmentsByID(id int) error {
	err := d.depRepo.DeleteByID(id)
	if err != nil {
		return err
	}
	return nil
}
