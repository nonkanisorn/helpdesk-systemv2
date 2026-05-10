package domain

import "time"

type Tickets struct {
	TicketID          int        `db:"ticket_id"`
	Title             string     `db:"title"`
	Description       string     `db:"description"`
	ResolutionNote    *string    `db:"resolution_note"`
	IssueCategoriesID int        `db:"issue_categories_id"`
	InstanceID        *int       `db:"instance_id"`
	UserID            int        `db:"user_id"`
	TechnicianID      *int       `db:"technician_id"`
	ManagerID         *int       `db:"manager_id"`
	StatusID          int        `db:"status_id"`
	CreatedAt         time.Time  `db:"created_at"`
	AssignedDate      *time.Time `db:"assigned_at"`
	StartAt           *time.Time `db:"started_at"`
	CompletedAt       *time.Time `db:"completed_at"`
	ClosedAt          *time.Time `db:"closed_at"`
}
type TicketCompleteRequest struct {
	ResolutionNote string `json:"resolution_note"`
	SerialNumber   string `json:"serial_number"`
}
type TicketsForTechnicianResponse struct {
	TicketID    int        `json:"ticket_id"`
	IssueName   string     `json:"issue_name"`
	FirstName   string     `json:"first_name"`
	LastName    string     `json:"last_name"`
	DepName     string     `json:"dep_name"`
	Phone       string     `json:"phone"`
	Description string     `json:"description"`
	Title       string     `json:"title"`
	CreatedAt   *time.Time `json:"created_at"`
	AssignedAt  *time.Time `json:"assigned_at"`
	StartAt     *time.Time `json:"started_at"`
	CompletedAt *time.Time `json:"completed_at"`
	ClosedAt    *time.Time `json:"closed_at"`
}
type TicketsAssginTechRequest struct {
	TicketID int `json:"ticket_id"`
	// StatusID     int  `json:"status_id"`
	TechnicianID *int `json:"technician_id"`
	ManagerID    *int `json:"manager_id"`
}
type TicketsResponse struct {
	TicketID          int        `db:"ticket_id" json:"ticket_id"`
	Title             string     `db:"title" json:"title"`
	Description       string     `db:"description" json:"description"`
	ResolutionNote    *string    `db:"resolution_note" json:"resolution_note"`
	IssueCategoriesID int        `db:"issue_categories_id" json:"issue_categories_id"`
	InstanceID        *int       `db:"instance_id" json:"instance_id"`
	UserID            int        `db:"user_id" json:"user_id"`
	TechnicianID      *int       `db:"technician_id" json:"technician_id"`
	ManagerID         *int       `db:"manager_id" json:"manager_id"`
	StatusID          int        `db:"status_id" json:"status_id"`
	CreatedAt         time.Time  `db:"created_at" json:"created_at"`
	AssignedDate      *time.Time `db:"assigned_at" json:"assigned_at"`
	StartAt           *time.Time `db:"started_at" json:"started_at"`
	CompletedAt       *time.Time `db:"completed_at" json:"completed_at"`
	ClosedAt          *time.Time `db:"closed_at" json:"closed_at"`

	// 🔥 user (match alias จาก query)
	UserIDJoin       int     `db:"user_id_join" json:"user_id_join"`
	UserUsername     string  `db:"user_username" json:"user_username"`
	UserFirstName    string  `db:"user_first_name" json:"user_first_name"`
	UserLastName     string  `db:"user_last_name" json:"user_last_name"`
	UserEmail        string  `db:"user_email" json:"user_email"`
	UserPhone        *string `db:"user_phone" json:"user_phone"`
	UserRoleID       int     `db:"user_role_id" json:"user_role_id"`
	UserDepartmentID *int    `db:"user_department_id" json:"user_department_id"`
}
