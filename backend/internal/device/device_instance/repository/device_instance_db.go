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
	query := `
		SELECT
			id,
			device_id,
			serial_number,
			device_number,
			department_id,
			COALESCE(status, 'active') AS status
		FROM device_instances
		WHERE COALESCE(status, 'active') = 'active'
		ORDER BY id
	`
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
			department_id,
			status
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
			?,
			'active'
		)
	`
	_, err := d.db.Exec(query, deviceID, serialNumber, deviceID, depID)
	if err != nil {
		return err
	}
	return nil
}

func (d deviceInstanceRepository) UpdateDeviceInstanceByID(instanceID int, depID *int, serialNumber string, status string) error {
	query := `
		UPDATE device_instances
		SET
			serial_number = ?,
			department_id = ?,
			status = ?
		WHERE id = ?
	`

	_, err := d.db.Exec(query, serialNumber, depID, status, instanceID)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceInstanceRepository) DeleteDeviceInstanceByID(instanceID int) error {
	query := "UPDATE device_instances SET status = 'inactive' WHERE id = ? AND COALESCE(status, 'active') = 'active'"
	_, err := d.db.Exec(query, instanceID)
	if err != nil {
		return err
	}

	return nil
}
