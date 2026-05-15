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
