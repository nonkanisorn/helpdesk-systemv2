package domain

import "time"

type DeviceInstanceResponse struct {
	ID           int     `json:"device_instance_id"`
	DeviceID     *int    `json:"device_id"`
	SerialNumber string  `json:"serial_number"`
	DeviceNumber int     `json:"device_number"`
	DeviceName   *string `json:"device_name"`
	DepartmentID *int    `json:"dep_id"`
}

type DeviceInstanceCreateRequest struct {
	DeviceID     int    `json:"device_id"`
	DeviceNumber int    `json:"device_number"`
	DepartmentID int    `json:"dep_id"`
	SerialNumber string `json:"serial_number"`
}

type DeviceInstance struct {
	ID           *int   `db:"id"`
	DeviceID     *int   `db:"device_id"`
	SerialNumber string `db:"serial_number"`
	DeviceNumber int    `db:"device_number"`
	DepartmentID *int   `db:"department_id"`
}

type HistoryRepairDeviceInstance struct {
	ID               int
	Title            string
	Description      *string
	ResolutionNote   *string
	IssueCategoryID  int
	DeviceInstanceID int
	UserID           int
	TechnicianID     *int
	ManagerID        *int
	StatusID         int
	CreatedAt        time.Time
	AssignedAt       *time.Time
	StartedAt        *time.Time
	CompletedAt      *time.Time
	ClosedAt         *time.Time
}

type HistoryRepairDeviceInstanceResponse struct {
	ID               int        `json:"ticket_id"`
	Title            string     `json:"title"`
	Description      *string    `json:"description"`
	ResolutionNote   *string    `json:"resolution_note"`
	IssueCategoryID  int        `json:"issue_categories_id"`
	DeviceInstanceID int        `json:"instance_id"`
	UserID           int        `json:"user_id"`
	TechnicianID     *int       `json:"technician_id"`
	ManagerID        *int       `json:"manager_id"`
	StatusID         int        `json:"status_id"`
	CreatedAt        time.Time  `json:"created_at"`
	AssignedAt       *time.Time `json:"assigned_at"`
	StartedAt        *time.Time `json:"started_at"`
	CompletedAt      *time.Time `json:"completed_at"`
	ClosedAt         *time.Time `json:"closed_at"`
}
