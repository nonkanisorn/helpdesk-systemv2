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
			di.id,
			di.device_id,
			di.serial_number,
			di.device_number,
			di.department_id,
			COALESCE(di.status, 'active') AS status,
			COALESCE(d.name, '') AS device_name,
			COALESCE(dt.name, '') AS device_type_name,
			COALESCE(dep.name, '') AS department_name
		FROM device_instances di
		LEFT JOIN devices d ON di.device_id = d.id
		LEFT JOIN device_types dt ON d.device_type_id = dt.id
		LEFT JOIN departments dep ON di.department_id = dep.id
		WHERE COALESCE(di.status, 'active') = 'active'
		ORDER BY di.serial_number ASC, di.id ASC
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
