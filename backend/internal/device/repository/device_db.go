package repository

import "github.com/jmoiron/sqlx"

type deviceRepositoryDB struct {
	db *sqlx.DB
}

func NewDeviceRepository(db *sqlx.DB) DeviceRepository {
	return &deviceRepositoryDB{db: db}
}

//	func (d deviceRepositoryDB) GetAll() ([]Device, error) {
//		var devices []Device
//		query := "select dev_id,dev_name,dev_type,dev_description from devices"
//		err := d.db.Select(&devices, query)
//		if err != nil {
//			return nil, err
//		}
//		return devices, nil
//	}
func (d deviceRepositoryDB) GetAll() ([]Device, error) {
	var devices []Device

	query := `
		SELECT 
			d.id,
			d.name,
			d.description,
			COALESCE(d.device_type_id, 0) AS device_type_id,
			COUNT(di.id) AS number_of_instance_device
		FROM devices d
		LEFT JOIN device_instances di
			ON di.device_id = d.id
			AND COALESCE(di.status, 'active') = 'active'
		WHERE d.deleted_at IS NULL
		GROUP BY d.id, d.name, d.description, d.device_type_id
		ORDER BY d.id
	`

	err := d.db.Select(&devices, query)
	if err != nil {
		return nil, err
	}

	return devices, nil
}

//	func (d deviceRepositoryDB) Create(deviceName string, deviceDescription string, deviceType int) error {
//		query := "insert into devices(dev_name,dev_description,dev_type) values (?,?,?)"
//		_, err := d.db.Exec(query, deviceName, deviceDescription, deviceType)
//		if err != nil {
//			return err
//		}
//		return nil
//	}
func (d deviceRepositoryDB) Create(deviceName string, deviceDescription string, deviceTypeID int) error {
	query := `
		INSERT INTO devices (
			name,
			description,
			device_type_id
		)
		VALUES (?, ?, ?)
	`

	_, err := d.db.Exec(query, deviceName, deviceDescription, deviceTypeID)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceRepositoryDB) Update(deviceID int, deviceName string, deviceDescription string, deviceTypeID int) error {
	query := `
		UPDATE devices
		SET
			name = ?,
			description = ?,
			device_type_id = ?
		WHERE id = ?
			AND deleted_at IS NULL
	`

	_, err := d.db.Exec(query, deviceName, deviceDescription, deviceTypeID, deviceID)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceRepositoryDB) Delete(deviceID int) error {
	tx, err := d.db.Beginx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := `
		UPDATE devices
		SET deleted_at = NOW()
		WHERE id = ?
			AND deleted_at IS NULL
	`
	if _, err := tx.Exec(query, deviceID); err != nil {
		return err
	}

	instanceQuery := `
		UPDATE device_instances
		SET status = 'inactive'
		WHERE device_id = ?
			AND COALESCE(status, 'active') = 'active'
	`
	if _, err := tx.Exec(instanceQuery, deviceID); err != nil {
		return err
	}

	return tx.Commit()
}
