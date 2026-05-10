package repository

import "github.com/jmoiron/sqlx"

type deviceTypeRepositoryDB struct {
	db *sqlx.DB
}

func NewDeviceTypeRepository(db *sqlx.DB) DeviceTypeRepository {
	return &deviceTypeRepositoryDB{db: db}
}

func (d deviceTypeRepositoryDB) GetAll() ([]DeviceType, error) {
	var deviceType []DeviceType
	query := "select devicetype_id, devicetype_name from device_types"
	err := d.db.Select(&deviceType, query)
	if err != nil {
		return nil, err
	}

	return deviceType, nil
}
