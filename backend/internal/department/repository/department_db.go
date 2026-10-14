package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type departmentRepositoryDB struct {
	db *sqlx.DB
}

func NewDepartmentRepositoryDB(db *sqlx.DB) DepartmentRepository {
	return departmentRepositoryDB{db: db}
}

type departmentRow struct {
	ID   int64  `db:"id"`
	Name string `db:"name"`
}

func (d departmentRepositoryDB) GetAll() ([]Department, error) {
	departments := []Department{}

	query := `
		SELECT 
			id,
			name
		FROM departments
		WHERE deleted_at IS NULL
		ORDER BY id
	`

	err := d.db.Select(&departments, query)
	if err != nil {
		return nil, err
	}

	return departments, nil
}

func (d departmentRepositoryDB) GetByID(id int) (*Department, error) {
	var department Department

	query := `
		SELECT 
			id,
			name
		FROM departments
		WHERE id = ?
			AND deleted_at IS NULL
	`

	err := d.db.Get(&department, query, id)
	if err != nil {
		return nil, err
	}

	return &department, nil
}

func (d departmentRepositoryDB) Create(departmentName string) error {
	query := `
		INSERT INTO departments (name)
		VALUES (?)
	`

	_, err := d.db.Exec(query, departmentName)
	if err != nil {
		return err
	}

	return nil
}

func (d departmentRepositoryDB) UpdateByID(id int, departmentName string) error {
	query := `
		UPDATE departments
		SET name = ?
		WHERE id = ?
			AND deleted_at IS NULL
	`

	_, err := d.db.Exec(query, departmentName, id)
	if err != nil {
		return err
	}

	return nil
}

func (d departmentRepositoryDB) DeleteByID(id int) error {
	var userCount int
	if err := d.db.Get(
		&userCount,
		"SELECT COUNT(1) FROM users WHERE department_id = ? AND status <> 'inactive'",
		id,
	); err != nil {
		return err
	}
	if userCount > 0 {
		return fmt.Errorf("%w: ไม่สามารถลบแผนกได้ เนื่องจากยังมีผู้ใช้อยู่ในแผนกนี้", domain.ErrResourceInUse)
	}

	var deviceInstanceCount int
	if err := d.db.Get(
		&deviceInstanceCount,
		"SELECT COUNT(1) FROM device_instances WHERE department_id = ? AND COALESCE(status, 'active') = 'active'",
		id,
	); err != nil {
		return err
	}
	if deviceInstanceCount > 0 {
		return fmt.Errorf("%w: ไม่สามารถลบแผนกได้ เนื่องจากยังมีรายการอุปกรณ์อยู่ในแผนกนี้", domain.ErrResourceInUse)
	}

	query := `
		UPDATE departments
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
