package repository

import (
	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type deviceInstanceRepository struct {
	db *sqlx.DB
}

func NewDeviceInstanceRepository(db *sqlx.DB) DeviceInstanceRepository {
	return deviceInstanceRepository{db: db}
}

func (d deviceInstanceRepository) GetAll() ([]domain.DeviceInstance, error) {
	var deviceInstances []domain.DeviceInstance
	query := "select instance_id, device_id, serial_number, device_number, dep_id from device_instances"
	err := d.db.Select(&deviceInstances, query)
	if err != nil {
		return nil, err
	}
	return deviceInstances, nil
}

func (d deviceInstanceRepository) Create(deviceID int, depID int, serialNumber string) error {
	query := `INSERT INTO helpdesk_system.device_instances (
    device_id,
    serial_number,
    device_number,
    dep_id
)
VALUES (
    ?,
    ?,
    (
        SELECT *
        FROM (
            SELECT COALESCE(MAX(device_number), 0) + 1
            FROM device_instances
            WHERE device_id = ?
        ) AS temp
    ),
    ?
);`
	_, err := d.db.Exec(query, deviceID, serialNumber, deviceID, depID)
	if err != nil {
		return err
	}
	return nil
}

func (d deviceInstanceRepository) DeleteDeviceInstanceByID(instanceID int) error {
	query := "delete from device_instances where instance_id = ? "
	d.db.Exec(query, instanceID)
	return nil
}
