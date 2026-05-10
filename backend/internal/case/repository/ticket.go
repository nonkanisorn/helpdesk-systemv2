package repository

import (
	"time"
)

type CreateTicketRow struct {
	UserID            int    `db:"user_id"`
	StatusID          int    `db:"status_id"`
	Title             string `db:"title"`
	Description       string `db:"description"`
	IssueCategoriesID int    `db:"issue_categories_id"`
}
type UpdateTicketRow struct {
	TicketID     int  `db:"ticket_id"`
	StatusID     int  `db:"status_id"`
	TechnicianID *int `db:"technician_id"`
	ManagerID    *int `db:"manager_id"`
}
type TicketRow struct {
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
type TicketsForTechnicianRow struct {
	TicketID    int        `db:"ticket_id"`
	IssueName   string     `db:"issue_name"`
	FirstName   string     `db:"first_name"`
	LastName    string     `db:"last_name"`
	DepName     string     `db:"dep_name"`
	Phone       string     `db:"phone"`
	Description string     `db:"description"`
	Title       string     `db:"title"`
	CreatedAt   *time.Time `db:"created_at"`
	AssignedAt  *time.Time `db:"assigned_at"`
	StartAt     *time.Time `db:"started_at"`
	CompletedAt *time.Time `db:"completed_at"`
	ClosedAt    *time.Time `db:"closed_at"`
}
type TicketQueryRepository interface {
	// ---- technician part ----
	StartJobByTechnicianID(int) error
	CompletedJobByTechnician(int, *int, string) error
	WaitingForPartByTechnicianID(ticketID int) error
	// ---- end technicina part ----

	// ---- manager part ----
	AssignTechToTickets(int, int, int) error
	// ---- end manager part ----

	// ---- user part ----
	ConfirmAndCloseTicketByUser(int) error
	// ---- end user part ----
	UpdateStatusTicket(*UpdateTicketRow) error
	GetTicketsByTechnicianID(int) ([]TicketRow, error)
	GetTicketForTechnicianByTicketID(int) (*TicketsForTechnicianRow, error)
	GetTicketsByUsersID(int) ([]TicketRow, error)
	UpdateStatusTicketByTechnician(*TicketRow) error
	UpdateStatusCompleteByTechnician(*TicketRow) error
	GetLatestTickets(int, int) ([]TicketRow, error)
	GetTicketsByStatusID(int) ([]TicketRow, error)
	GetTicketForAutoClose() ([]int, error)
	AutoCloseTickets(int) error
}
type TicketRepository interface {
	GetAllTickets() ([]TicketRow, error)
	GetTicketByID(int) (*TicketRow, error)
	CreateTicket(*CreateTicketRow) error
}
