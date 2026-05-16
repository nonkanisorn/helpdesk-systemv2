package repository

import (
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
}

type HistoryRepairDeviceInstanceRow struct {
	ID               int        `db:"id"`
	Title            string     `db:"title"`
	Description      *string    `db:"description"`
	ResolutionNote   *string    `db:"resolution_note"`
	IssueCategoryID  int        `db:"issue_category_id"`
	DeviceInstanceID int        `db:"device_instance_id"`
	UserID           int        `db:"user_id"`
	TechnicianID     *int       `db:"technician_id"`
	ManagerID        *int       `db:"manager_id"`
	StatusID         int        `db:"status_id"`
	CreatedAt        time.Time  `db:"created_at"`
	AssignedAt       *time.Time `db:"assigned_at"`
	StartedAt        *time.Time `db:"started_at"`
	CompletedAt      *time.Time `db:"completed_at"`
	ClosedAt         *time.Time `db:"closed_at"`
}

func (d deviceInstanceQueryRepositoryDB) CheckSerialNumber(serialNumber string) (int, error) {
	var deviceInstanceID int

	query := `
		SELECT id
		FROM device_instances
		WHERE serial_number = ?
	`

	err := d.db.Get(&deviceInstanceID, query, serialNumber)
	if err != nil {
		return 0, err
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
			department_id
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
		})
	}

	return deviceInstances, nil
}

func (d deviceInstanceQueryRepositoryDB) GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID int) ([]domain.HistoryRepairDeviceInstance, error) {
	var deviceInstances []domain.HistoryRepairDeviceInstance
	var rows []HistoryRepairDeviceInstanceRow

	query := `
		SELECT 
			id,
			title,
			description,
			resolution_note,
			issue_category_id,
			device_instance_id,
			user_id,
			technician_id,
			manager_id,
			status_id,
			created_at,
			assigned_at,
			started_at,
			completed_at,
			closed_at
		FROM tickets
		WHERE device_instance_id = ?
	`

	err := d.db.Select(&rows, query, deviceInstanceID)
	if err != nil {
		return nil, err
	}

	for _, v := range rows {
		deviceInstances = append(deviceInstances, domain.HistoryRepairDeviceInstance{
			ID:               v.ID,
			Title:            v.Title,
			Description:      v.Description,
			ResolutionNote:   v.ResolutionNote,
			IssueCategoryID:  v.IssueCategoryID,
			DeviceInstanceID: v.DeviceInstanceID,
			UserID:           v.UserID,
			TechnicianID:     v.TechnicianID,
			ManagerID:        v.ManagerID,
			StatusID:         v.StatusID,
			CreatedAt:        v.CreatedAt,
			AssignedAt:       v.AssignedAt,
			StartedAt:        v.StartedAt,
			CompletedAt:      v.CompletedAt,
			ClosedAt:         v.ClosedAt,
		})
	}

	return deviceInstances, nil
}
