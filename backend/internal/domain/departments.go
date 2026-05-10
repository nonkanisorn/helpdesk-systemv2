package domain

type DepartmentsRequest struct {
	DepID   int    `json:"dep_id"`
	DepName string `json:"dep_name"`
}
