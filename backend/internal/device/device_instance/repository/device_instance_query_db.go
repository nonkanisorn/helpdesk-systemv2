package repository

import (
	"database/sql"
	"errors"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type deviceInstanceQueryRepositoryDB struct {
	db *sqlx.DB
}

func NewDeviceInstanceQueryRepositoryDB(db *sqlx.DB) DeviceInstanceQueryRepository {
	return deviceInstanceQueryRepositoryDB{db: db}
}

type DeviceInstanceRow struct {
	ID           *int   `db:"id"`
	DeviceID     *int   `db:"device_id"`
	SerialNumber string `db:"serial_number"`
	DeviceNumber int    `db:"device_number"`
	DepartmentID *int   `db:"department_id"`
	Status       string `db:"status"`
}

type HistoryRepairDeviceInstanceRow struct {
	ID                  int        `db:"id"`
	Title               string     `db:"title"`
	Description         *string    `db:"description"`
	ResolutionNote      *string    `db:"resolution_note"`
	IssueCategoryID     int        `db:"issue_category_id"`
	IssueCategoryName   *string    `db:"issue_category_name"`
	DeviceInstanceID    int        `db:"device_instance_id"`
	SerialNumber        *string    `db:"serial_number"`
	DeviceName          *string    `db:"device_name"`
	DeviceTypeName      *string    `db:"device_type_name"`
	DepartmentName      *string    `db:"department_name"`
	UserID              int        `db:"user_id"`
	TechnicianID        *int       `db:"technician_id"`
	TechnicianFirstName *string    `db:"technician_first_name"`
	TechnicianLastName  *string    `db:"technician_last_name"`
	ManagerID           *int       `db:"manager_id"`
	StatusID            int        `db:"status_id"`
	StatusName          *string    `db:"status_name"`
	CreatedAt           time.Time  `db:"created_at"`
	AssignedAt          *time.Time `db:"assigned_at"`
	StartedAt           *time.Time `db:"started_at"`
	CompletedAt         *time.Time `db:"completed_at"`
	ClosedAt            *time.Time `db:"closed_at"`
}

func (d deviceInstanceQueryRepositoryDB) CheckSerialNumber(serialNumber string) (int, error) {
	var deviceInstanceID int
	row := struct {
		ID     int    `db:"id"`
		Status string `db:"status"`
	}{}
	query := `SELECT id, COALESCE(status, 'active') AS status FROM device_instances WHERE serial_number = ?`
	err := d.db.Get(&row, query, serialNumber)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, domain.ErrDeviceSerialNotFound
		}
		return 0, err
	}
	deviceInstanceID = row.ID
	if row.Status != "active" {
		return 0, domain.ErrDeviceUnavailable
	}

	return deviceInstanceID, nil
}

func (d deviceInstanceQueryRepositoryDB) GetDeviceInstanceByDeviceID(deviceID int) ([]domain.DeviceInstance, error) {
	var deviceInstances []domain.DeviceInstance
	deviceInstanceRows := []DeviceInstanceRow{}

	query := `
		SELECT 
			id,
			device_id,
			serial_number,
			device_number,
			department_id,
			COALESCE(status, 'active') AS status
		FROM device_instances
		WHERE device_id = ?
		ORDER BY device_number, id
	`

	err := d.db.Select(&deviceInstanceRows, query, deviceID)
	if err != nil {
		return nil, err
	}

	for _, v := range deviceInstanceRows {
		deviceInstances = append(deviceInstances, domain.DeviceInstance{
			ID:           v.ID,
			DeviceID:     v.DeviceID,
			SerialNumber: v.SerialNumber,
			DeviceNumber: v.DeviceNumber,
			DepartmentID: v.DepartmentID,
			Status:       v.Status,
		})
	}

	return deviceInstances, nil
}

func (d deviceInstanceQueryRepositoryDB) GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID int) ([]domain.HistoryRepairDeviceInstance, error) {
	var deviceInstances []domain.HistoryRepairDeviceInstance
	var rows []HistoryRepairDeviceInstanceRow

	query := `
		SELECT 
			t.id,
			t.title,
			t.description,
			t.resolution_note,
			t.issue_category_id,
			ic.name AS issue_category_name,
			t.device_instance_id,
			di.serial_number,
			d.name AS device_name,
			dt.name AS device_type_name,
			dep.name AS department_name,
			t.user_id,
			t.technician_id,
			tech.first_name AS technician_first_name,
			tech.last_name AS technician_last_name,
			t.manager_id,
			t.status_id,
			ts.name AS status_name,
			t.created_at,
			t.assigned_at,
			t.started_at,
			t.completed_at,
			t.closed_at
		FROM tickets t
		LEFT JOIN issue_categories ic
			ON t.issue_category_id = ic.id
		LEFT JOIN device_instances di
			ON t.device_instance_id = di.id
		LEFT JOIN devices d
			ON di.device_id = d.id
		LEFT JOIN device_types dt
			ON d.device_type_id = dt.id
		LEFT JOIN departments dep
			ON di.department_id = dep.id
		LEFT JOIN users tech
			ON t.technician_id = tech.id
		LEFT JOIN ticket_statuses ts
			ON t.status_id = ts.id
		WHERE t.device_instance_id = ?
		ORDER BY t.created_at DESC, t.id DESC
	`

	err := d.db.Select(&rows, query, deviceInstanceID)
	if err != nil {
		return nil, err
	}

	for _, v := range rows {
		deviceInstances = append(deviceInstances, domain.HistoryRepairDeviceInstance{
			ID:                  v.ID,
			Title:               v.Title,
			Description:         v.Description,
			ResolutionNote:      v.ResolutionNote,
			IssueCategoryID:     v.IssueCategoryID,
			IssueCategoryName:   v.IssueCategoryName,
			DeviceInstanceID:    v.DeviceInstanceID,
			SerialNumber:        v.SerialNumber,
			DeviceName:          v.DeviceName,
			DeviceTypeName:      v.DeviceTypeName,
			DepartmentName:      v.DepartmentName,
			UserID:              v.UserID,
			TechnicianID:        v.TechnicianID,
			TechnicianFirstName: v.TechnicianFirstName,
			TechnicianLastName:  v.TechnicianLastName,
			ManagerID:           v.ManagerID,
			StatusID:            v.StatusID,
			StatusName:          v.StatusName,
			CreatedAt:           v.CreatedAt,
			AssignedAt:          v.AssignedAt,
			StartedAt:           v.StartedAt,
			CompletedAt:         v.CompletedAt,
			ClosedAt:            v.ClosedAt,
		})
	}

	return deviceInstances, nil
}
