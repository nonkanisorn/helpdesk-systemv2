package domain

import "time"

type Ticketsold struct {
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
type Tickets struct {
	ID               int        `db:"id" json:"ticket_id"`
	Title            string     `db:"title" json:"title"`
	Description      string     `db:"description" json:"description"`
	ResolutionNote   *string    `db:"resolution_note" json:"resolution_note"`
	IssueCategoryID  int        `db:"issue_category_id" json:"issue_categories_id"`
	DeviceInstanceID *int       `db:"device_instance_id" json:"instance_id"`
	UserID           int        `db:"user_id" json:"user_id"`
	TechnicianID     *int       `db:"technician_id" json:"technician_id"`
	ManagerID        *int       `db:"manager_id" json:"manager_id"`
	StatusID         int        `db:"status_id" json:"status_id"`
	CreatedAt        time.Time  `db:"created_at" json:"created_at"`
	AssignedAt       *time.Time `db:"assigned_at"`
	StartedAt        *time.Time `db:"started_at"`
	CompletedAt      *time.Time `db:"completed_at"`
	ClosedAt         *time.Time `db:"closed_at"`
}
type TicketCompleteRequest struct {
	ResolutionNote string  `json:"resolution_note"`
	SerialNumber   *string `json:"serial_number"`
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
type TicketsResponseold struct {
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
type TicketsResponse struct {
	ID               int        `db:"id" json:"ticket_id"`
	Title            string     `db:"title" json:"title"`
	Description      string     `db:"description" json:"description"`
	ResolutionNote   *string    `db:"resolution_note" json:"resolution_note"`
	IssueCategoryID  int        `db:"issue_category_id" json:"issue_categories_id"`
	DeviceInstanceID *int       `db:"device_instance_id" json:"instance_id"`
	UserID           int        `db:"user_id" json:"user_id"`
	TechnicianID     *int       `db:"technician_id" json:"technician_id"`
	ManagerID        *int       `db:"manager_id" json:"manager_id"`
	StatusID         int        `db:"status_id" json:"status_id"`
	CreatedAt        time.Time  `db:"created_at" json:"created_at"`
	AssignedAt       *time.Time `db:"assigned_at" json:"assigned_at"`
	StartedAt        *time.Time `db:"started_at" json:"started_at"`
	CompletedAt      *time.Time `db:"completed_at" json:"completed_at"`
	ClosedAt         *time.Time `db:"closed_at" json:"closed_at"`

	// user join
	UserIDJoin       int     `db:"user_id_join" json:"user_id_join"`
	UserUsername     string  `db:"user_username" json:"user_username"`
	UserFirstName    string  `db:"user_first_name" json:"user_first_name"`
	UserLastName     string  `db:"user_last_name" json:"user_last_name"`
	UserEmail        string  `db:"user_email" json:"user_email"`
	UserPhone        *string `db:"user_phone" json:"user_phone"`
	UserRoleID       int     `db:"user_role_id" json:"user_role_id"`
	UserDepartmentID *int    `db:"user_department_id" json:"user_department_id"`
}
type TicketDetailold struct {
	TicketID       int     `db:"ticket_id" json:"ticket_id"`
	Title          string  `db:"title" json:"title"`
	Description    string  `db:"description" json:"description"`
	ResolutionNote *string `db:"resolution_note" json:"resolution_note"`

	IssueCategoriesID int     `db:"issue_categories_id" json:"issue_categories_id"`
	IssueCategoryName *string `db:"issues_categories_name" json:"issues_categories_name"`

	InstanceID *int `db:"instance_id" json:"instance_id"`

	UserID       int  `db:"user_id" json:"user_id"`
	TechnicianID *int `db:"technician_id" json:"technician_id"`
	ManagerID    *int `db:"manager_id" json:"manager_id"`

	StatusID   int     `db:"status_id" json:"status_id"`
	StatusName *string `db:"status_name" json:"status_name"`

	CreatedAt   time.Time  `db:"created_at" json:"created_at"`
	AssignedAt  *time.Time `db:"assigned_at" json:"assigned_at"`
	StartedAt   *time.Time `db:"started_at" json:"started_at"`
	CompletedAt *time.Time `db:"completed_at" json:"completed_at"`
	ClosedAt    *time.Time `db:"closed_at" json:"closed_at"`

	// User
	UserIDJoin         *int    `db:"user_id_join" json:"user_id_join"`
	UserFirstName      *string `db:"user_first_name" json:"user_first_name"`
	UserLastName       *string `db:"user_last_name" json:"user_last_name"`
	UserEmail          *string `db:"user_email" json:"user_email"`
	UserPhone          *string `db:"user_phone" json:"user_phone"`
	UserDepartmentID   *int    `db:"user_department_id" json:"user_department_id"`
	UserDepartmentName *string `db:"user_department_name" json:"user_department_name"`

	// Manager
	ManagerIDJoin         *int    `db:"manager_id_join" json:"manager_id_join"`
	ManagerFirstName      *string `db:"manager_first_name" json:"manager_first_name"`
	ManagerLastName       *string `db:"manager_last_name" json:"manager_last_name"`
	ManagerEmail          *string `db:"manager_email" json:"manager_email"`
	ManagerPhone          *string `db:"manager_phone" json:"manager_phone"`
	ManagerDepartmentID   *int    `db:"manager_department_id" json:"manager_department_id"`
	ManagerDepartmentName *string `db:"manager_department_name" json:"manager_department_name"`

	// Technician
	TechnicianIDJoin         *int    `db:"technician_id_join" json:"technician_id_join"`
	TechnicianFirstName      *string `db:"technician_first_name" json:"technician_first_name"`
	TechnicianLastName       *string `db:"technician_last_name" json:"technician_last_name"`
	TechnicianEmail          *string `db:"technician_email" json:"technician_email"`
	TechnicianPhone          *string `db:"technician_phone" json:"technician_phone"`
	TechnicianDepartmentID   *int    `db:"technician_department_id" json:"technician_department_id"`
	TechnicianDepartmentName *string `db:"technician_department_name" json:"technician_department_name"`

	// Device Instance
	DeviceInstanceID     *int    `db:"device_instance_id" json:"device_instance_id"`
	SerialNumber         *string `db:"serial_number" json:"serial_number"`
	DeviceNumber         *string `db:"device_number" json:"device_number"`
	DeviceDepartmentID   *int    `db:"device_department_id" json:"device_department_id"`
	DeviceDepartmentName *string `db:"device_department_name" json:"device_department_name"`

	// Device
	DeviceID          *int    `db:"device_id" json:"device_id"`
	DeviceName        *string `db:"device_name" json:"device_name"`
	DeviceDescription *string `db:"device_description" json:"device_description"`

	// Device Type
	DeviceTypeID   *int    `db:"device_type_id" json:"device_type_id"`
	DeviceTypeName *string `db:"device_type_name" json:"device_type_name"`
}
type TicketDetail struct {
	ID             int     `db:"id" json:"ticket_id"`
	Title          string  `db:"title" json:"title"`
	Description    string  `db:"description" json:"description"`
	ResolutionNote *string `db:"resolution_note" json:"resolution_note"`

	IssueCategoryID   int     `db:"issue_category_id" json:"issue_categories_id"`
	IssueCategoryName *string `db:"issue_category_name" json:"issues_categories_name"`

	DeviceInstanceID *int `db:"device_instance_id" json:"instance_id"`

	UserID       int  `db:"user_id" json:"user_id"`
	TechnicianID *int `db:"technician_id" json:"technician_id"`
	ManagerID    *int `db:"manager_id" json:"manager_id"`

	StatusID   int     `db:"status_id" json:"status_id"`
	StatusName *string `db:"status_name" json:"status_name"`

	CreatedAt   time.Time  `db:"created_at" json:"created_at"`
	AssignedAt  *time.Time `db:"assigned_at" json:"assigned_at"`
	StartedAt   *time.Time `db:"started_at" json:"started_at"`
	CompletedAt *time.Time `db:"completed_at" json:"completed_at"`
	ClosedAt    *time.Time `db:"closed_at" json:"closed_at"`

	// User
	UserIDJoin         *int    `db:"user_id_join" json:"user_id_join"`
	UserFirstName      *string `db:"user_first_name" json:"user_first_name"`
	UserLastName       *string `db:"user_last_name" json:"user_last_name"`
	UserEmail          *string `db:"user_email" json:"user_email"`
	UserPhone          *string `db:"user_phone" json:"user_phone"`
	UserDepartmentID   *int    `db:"user_department_id" json:"user_department_id"`
	UserDepartmentName *string `db:"user_department_name" json:"user_department_name"`

	// Manager
	ManagerIDJoin         *int    `db:"manager_id_join" json:"manager_id_join"`
	ManagerFirstName      *string `db:"manager_first_name" json:"manager_first_name"`
	ManagerLastName       *string `db:"manager_last_name" json:"manager_last_name"`
	ManagerEmail          *string `db:"manager_email" json:"manager_email"`
	ManagerPhone          *string `db:"manager_phone" json:"manager_phone"`
	ManagerDepartmentID   *int    `db:"manager_department_id" json:"manager_department_id"`
	ManagerDepartmentName *string `db:"manager_department_name" json:"manager_department_name"`

	// Technician
	TechnicianIDJoin         *int    `db:"technician_id_join" json:"technician_id_join"`
	TechnicianFirstName      *string `db:"technician_first_name" json:"technician_first_name"`
	TechnicianLastName       *string `db:"technician_last_name" json:"technician_last_name"`
	TechnicianEmail          *string `db:"technician_email" json:"technician_email"`
	TechnicianPhone          *string `db:"technician_phone" json:"technician_phone"`
	TechnicianDepartmentID   *int    `db:"technician_department_id" json:"technician_department_id"`
	TechnicianDepartmentName *string `db:"technician_department_name" json:"technician_department_name"`

	// Device Instance
	DeviceInstanceIDJoin *int    `db:"device_instance_id_join" json:"device_instance_id"`
	SerialNumber         *string `db:"serial_number" json:"serial_number"`
	DeviceNumber         *string `db:"device_number" json:"device_number"`
	DeviceDepartmentID   *int    `db:"device_department_id" json:"device_department_id"`
	DeviceDepartmentName *string `db:"device_department_name" json:"device_department_name"`

	// Device
	DeviceID          *int    `db:"device_id" json:"device_id"`
	DeviceName        *string `db:"device_name" json:"device_name"`
	DeviceDescription *string `db:"device_description" json:"device_description"`

	// Device Type
	DeviceTypeID   *int    `db:"device_type_id" json:"device_type_id"`
	DeviceTypeName *string `db:"device_type_name" json:"device_type_name"`
}
