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
	query := "SELECT id, device_id, serial_number, device_number, department_id FROM device_instances ORDER BY id"
	err := d.db.Select(&deviceInstances, query)
	if err != nil {
		return nil, err
	}
	return deviceInstances, nil
}

func (d deviceInstanceRepository) Create(deviceID int, depID *int, serialNumber string) error {
	query := `
		INSERT INTO device_instances (
			device_id,
			serial_number,
			device_number,
			department_id
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
		)
	`
	_, err := d.db.Exec(query, deviceID, serialNumber, deviceID, depID)
	if err != nil {
		return err
	}
	return nil
}

func (d deviceInstanceRepository) UpdateDeviceInstanceByID(instanceID int, depID *int, serialNumber string) error {
	query := `
		UPDATE device_instances
		SET
			serial_number = ?,
			department_id = ?
		WHERE id = ?
	`

	_, err := d.db.Exec(query, serialNumber, depID, instanceID)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceInstanceRepository) DeleteDeviceInstanceByID(instanceID int) error {
	query := "DELETE FROM device_instances WHERE id = ?"
	_, err := d.db.Exec(query, instanceID)
	if err != nil {
		return err
	}

	return nil
}
