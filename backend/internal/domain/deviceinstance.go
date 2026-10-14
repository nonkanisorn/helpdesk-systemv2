package domain

import "time"

type DeviceInstanceResponse struct {
	ID                int     `json:"device_instance_id"`
	InstanceID        int     `json:"instance_id"`
	DeviceID          *int    `json:"device_id"`
	SerialNumber      string  `json:"serial_number"`
	DeviceNumber      int     `json:"device_number"`
	DeviceName        *string `json:"device_name"`
	DepartmentID      *int    `json:"dep_id"`
	DepartmentIDAlias *int    `json:"department_id"`
	Status            string  `json:"status"`
}

type DeviceInstanceCreateRequest struct {
	DeviceID          int    `json:"device_id"`
	DeviceNumber      int    `json:"device_number"`
	DepartmentID      *int   `json:"dep_id"`
	DepartmentIDAlias *int   `json:"department_id"`
	SerialNumber      string `json:"serial_number"`
	Status            string `json:"status"`
}

type DeviceInstance struct {
	ID             *int    `db:"id"`
	DeviceID       *int    `db:"device_id"`
	SerialNumber   string  `db:"serial_number"`
	DeviceNumber   int     `db:"device_number"`
	DepartmentID   *int    `db:"department_id"`
	Status         string  `db:"status"`
	DeviceName     *string `db:"device_name"`
	DeviceTypeName *string `db:"device_type_name"`
	DepartmentName *string `db:"department_name"`
}

type HistoryRepairDeviceInstance struct {
	ID                  int
	Title               string
	Description         *string
	ResolutionNote      *string
	IssueCategoryID     int
	IssueCategoryName   *string
	DeviceInstanceID    int
	SerialNumber        *string
	DeviceName          *string
	DeviceTypeName      *string
	DepartmentName      *string
	UserID              int
	TechnicianID        *int
	TechnicianFirstName *string
	TechnicianLastName  *string
	ManagerID           *int
	StatusID            int
	StatusName          *string
	CreatedAt           time.Time
	AssignedAt          *time.Time
	StartedAt           *time.Time
	CompletedAt         *time.Time
	ClosedAt            *time.Time
}

type HistoryRepairDeviceInstanceResponse struct {
	ID                  int        `json:"ticket_id"`
	Title               string     `json:"title"`
	Description         *string    `json:"description"`
	ResolutionNote      *string    `json:"resolution_note"`
	IssueCategoryID     int        `json:"issue_categories_id"`
	IssueCategoryName   *string    `json:"issue_category_name"`
	DeviceInstanceID    int        `json:"instance_id"`
	SerialNumber        *string    `json:"serial_number"`
	DeviceName          *string    `json:"device_name"`
	DeviceTypeName      *string    `json:"device_type_name"`
	DepartmentName      *string    `json:"department_name"`
	UserID              int        `json:"user_id"`
	TechnicianID        *int       `json:"technician_id"`
	TechnicianFirstName *string    `json:"technician_first_name"`
	TechnicianLastName  *string    `json:"technician_last_name"`
	ManagerID           *int       `json:"manager_id"`
	StatusID            int        `json:"status_id"`
	StatusName          *string    `json:"status_name"`
	CreatedAt           time.Time  `json:"created_at"`
	AssignedAt          *time.Time `json:"assigned_at"`
	StartedAt           *time.Time `json:"started_at"`
	CompletedAt         *time.Time `json:"completed_at"`
	ClosedAt            *time.Time `json:"closed_at"`
}
