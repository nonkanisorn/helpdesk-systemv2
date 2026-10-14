package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

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
		WHERE deleted_at IS NULL
		ORDER BY id
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
			AND deleted_at IS NULL
	`

	_, err := d.db.Exec(query, deviceTypeName, id)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceTypeRepositoryDB) DeleteByID(id int) error {
	var deviceCount int
	if err := d.db.Get(
		&deviceCount,
		"SELECT COUNT(1) FROM devices WHERE device_type_id = ? AND deleted_at IS NULL",
		id,
	); err != nil {
		return err
	}
	if deviceCount > 0 {
		return fmt.Errorf("%w: ไม่สามารถลบประเภทอุปกรณ์ได้ เนื่องจากยังมีอุปกรณ์ที่ใช้ประเภทนี้อยู่", domain.ErrResourceInUse)
	}

	query := `
		UPDATE device_types
		SET deleted_at = NOW()
		WHERE id = ?
			AND deleted_at IS NULL
	`

	_, err := d.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}
