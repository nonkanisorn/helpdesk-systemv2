package repository

import (
	"fmt"
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
	DeviceInstanceID *int   `db:"instance_id"`
	DeviceID         *int   `db:"device_id"`
	SerialNumber     string `db:"serial_number"`
	DeviceName       int    `db:"device_number"`
	DepID            *int   `db:"dep_id"`
}

type HistoryRepairDeviceInstanceRow struct {
	TicketID          int        `db:"ticket_id"`
	Title             string     `db:"title"`
	Description       *string    `db:"description"`
	ResolutionNote    *string    `db:"resolution_note"`
	IssueCategoriesID int        `db:"issue_categories_id"`
	InstanceID        int        `db:"instance_id"`
	UserID            int        `db:"user_id"`
	TechnicianID      *int       `db:"technician_id"`
	ManagerID         *int       `db:"manager_id"`
	StatusID          int        `db:"status_id"`
	CreatedAt         time.Time  `db:"created_at"`
	AssignedAt        *time.Time `db:"assigned_at"`
	StartedAt         *time.Time `db:"started_at"`
	CompletedAt       *time.Time `db:"completed_at"`
	ClosedAt          *time.Time `db:"closed_at"`
}

func (d deviceInstanceQueryRepositoryDB) CheckSerialNumber(serialNumber string) (int, error) {
	var instanceID int
	query := "select instance_id from device_instances di where di.serial_number = ?"
	err := d.db.Get(&instanceID, query, serialNumber)
	if err != nil {
		return 0, err
	}
	return instanceID, nil
}

func (d deviceInstanceQueryRepositoryDB) GetDeviceInstanceByDeviceID(deviceID int) ([]domain.DeviceInstance, error) {
	var deviceInstance []domain.DeviceInstance
	deviceInstanceRows := []DeviceInstanceRow{}

	query := "select * from device_instances where device_id = ?"
	err := d.db.Select(&deviceInstanceRows, query, deviceID)
	if err != nil {
		return nil, err
	}
	fmt.Println("db", deviceInstanceRows)
	for _, v := range deviceInstanceRows {
		deviceInstance = append(deviceInstance, domain.DeviceInstance{
			DeviceInstanceID: v.DeviceInstanceID,
			DeviceID:         v.DeviceID,
			SerialNumber:     v.SerialNumber,
			DeviceName:       v.DeviceName,
			DepID:            v.DepID,
		})
	}
	return deviceInstance, nil
}

func (d deviceInstanceQueryRepositoryDB) GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID int) ([]domain.HistoryRepairDeviceInstance, error) {
	var deviceInstances []domain.HistoryRepairDeviceInstance
	var rows []HistoryRepairDeviceInstanceRow
	query := "select * from tickets where instance_id = ?"
	err := d.db.Select(&rows, query, deviceInstanceID)
	if err != nil {
		return nil, err
	}
	for _, v := range rows {
		deviceInstances = append(deviceInstances, domain.HistoryRepairDeviceInstance{
			TicketID:          v.TicketID,
			Title:             v.Title,
			Description:       v.Description,
			ResolutionNote:    v.ResolutionNote,
			IssueCategoriesID: v.IssueCategoriesID,
			InstanceID:        v.InstanceID,
			UserID:            v.UserID,
			TechnicianID:      v.TechnicianID,
			ManagerID:         v.ManagerID,
			StatusID:          v.StatusID,
			CreatedAt:         v.CreatedAt,
			AssignedAt:        v.AssignedAt,
			StartedAt:         v.StartedAt,
			CompletedAt:       v.CompletedAt,
			ClosedAt:          v.ClosedAt,
		})
	}
	return deviceInstances, nil
}
