package service

type DepartmentResponse struct {
	ID   int64  `db:"id" json:"dep_id"`
	Name string `db:"name" json:"dep_name"`
}
type DepartmentService interface {
	GetAllDepartments() ([]DepartmentResponse, error)
	GetDepartmentByID(int) (*DepartmentResponse, error)
	CreateDepartments(string) error
	DeleteDepartmentsByID(int) error
}
