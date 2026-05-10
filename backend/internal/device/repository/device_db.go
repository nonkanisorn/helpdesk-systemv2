package repository

import (
	"github.com/jmoiron/sqlx"
)

type deviceRepositoryDB struct {
	db *sqlx.DB
}

func NewDeviceRepository(db *sqlx.DB) DeviceRepository {
	return &deviceRepositoryDB{db: db}
}

func (d deviceRepositoryDB) GetAll() ([]Device, error) {
	var devices []Device
	query := "select dev_id,dev_name,dev_type,dev_description from devices"
	err := d.db.Select(&devices, query)
	if err != nil {
		return nil, err
	}
	return devices, nil
}

func (d deviceRepositoryDB) Create(deviceName string, deviceDescription string, deviceType int) error {
	query := "insert into devices(dev_name,dev_description,dev_type) values (?,?,?)"
	_, err := d.db.Exec(query, deviceName, deviceDescription, deviceType)
	if err != nil {
		return err
	}
	return nil
}

func (d deviceRepositoryDB) Delete(deviceID int) error {
	query := "delete from devices where dev_id = ? "
	_, err := d.db.Exec(query, deviceID)
	if err != nil {
		return err
	}
	return nil
}
