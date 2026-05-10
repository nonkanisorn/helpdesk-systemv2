package service

type DepartmentResponse struct {
	DepartmentID   int64  `db:"dep_id" json:"dep_id"`
	DepartmentName string `db:"dep_name" json:"dep_name"`
}
type DepartmentService interface {
	GetAllDepartments() ([]DepartmentResponse, error)
	GetDepartmentByID(int) (*DepartmentResponse, error)
	CreateDepartments(string) error
	DeleteDepartmentsByID(int) error
}
