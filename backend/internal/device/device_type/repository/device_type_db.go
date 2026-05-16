package repository

import "github.com/jmoiron/sqlx"

type deviceTypeRepositoryDB struct {
	db *sqlx.DB
}

func NewDeviceTypeRepository(db *sqlx.DB) DeviceTypeRepository {
	return &deviceTypeRepositoryDB{db: db}
}

func (d deviceTypeRepositoryDB) GetAll() ([]DeviceType, error) {
	var deviceTypes []DeviceType

	query := `
		SELECT 
			id,
			name
		FROM device_types
	`

	err := d.db.Select(&deviceTypes, query)
	if err != nil {
		return nil, err
	}

	return deviceTypes, nil
}

func (d deviceTypeRepositoryDB) Create(deviceTypeName string) error {
	query := `
		INSERT INTO device_types (name)
		VALUES (?)
	`

	_, err := d.db.Exec(query, deviceTypeName)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceTypeRepositoryDB) UpdateByID(id int, deviceTypeName string) error {
	query := `
		UPDATE device_types
		SET name = ?
		WHERE id = ?
	`

	_, err := d.db.Exec(query, deviceTypeName, id)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceTypeRepositoryDB) DeleteByID(id int) error {
	query := `
		DELETE FROM device_types
		WHERE id = ?
	`

	_, err := d.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}
