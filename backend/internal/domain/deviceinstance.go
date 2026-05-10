package domain

import "time"

type DeviceInstanceResponse struct {
	DeviceInstanceID int    `json:"device_instance_id"`
	DeviceID         *int   `json:"device_id"`
	SerialNumber     string `json:"serial_number"`
	DeviceName       int    `json:"device_name"`
	DepID            *int   `json:"dep_id"`
}
type DeviceInstanceCreateRequest struct {
	DeviceID     int    `json:"device_id"`
	DeviceNumber int    `json:"device_number"`
	DepID        int    `json:"dep_id"`
	SerialNumber string `json:"serial_number"`
}
type DeviceInstance struct {
	DeviceInstanceID *int   `db:"instance_id"`
	DeviceID         *int   `db:"device_id"`
	SerialNumber     string `db:"serial_number"`
	DeviceName       int    `db:"device_number"`
	DepID            *int   `db:"dep_id"`
}
type HistoryRepairDeviceInstance struct {
	TicketID          int
	Title             string
	Description       *string
	ResolutionNote    *string
	IssueCategoriesID int
	InstanceID        int
	UserID            int
	TechnicianID      *int
	ManagerID         *int
	StatusID          int
	CreatedAt         time.Time
	AssignedAt        *time.Time
	StartedAt         *time.Time
	CompletedAt       *time.Time
	ClosedAt          *time.Time
}

type HistoryRepairDeviceInstanceResponse struct {
	TicketID          int        `json:"ticket_id"`
	Title             string     `json:"title"`
	Description       *string    `json:"description"`
	ResolutionNote    *string    `json:"resolution_note"`
	IssueCategoriesID int        `json:"issue_categories_id"`
	InstanceID        int        `json:"instance_id"`
	UserID            int        `json:"user_id"`
	TechnicianID      *int       `json:"technician_id"`
	ManagerID         *int       `json:"manager_id"`
	StatusID          int        `json:"status_id"`
	CreatedAt         time.Time  `json:"created_at"`
	AssignedAt        *time.Time `json:"assigned_at"`
	StartedAt         *time.Time `json:"started_at"`
	CompletedAt       *time.Time `json:"completed_at"`
	ClosedAt          *time.Time `json:"closed_at"`
}
