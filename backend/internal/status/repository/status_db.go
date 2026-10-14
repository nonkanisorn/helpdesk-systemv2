package repository

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type statusRepositoryDB struct {
	db *sqlx.DB
}

func NewStatusRepositoryDB(db *sqlx.DB) statusRepositoryDB {
	return statusRepositoryDB{db: db}
}

func (s statusRepositoryDB) Create(statusName string) (*Status, error) {
	query := `
		INSERT INTO ticket_statuses (name)
		VALUES (?)
	`

	result, err := s.db.Exec(query, statusName)
	if err != nil {
		return nil, err
	}

	id, _ := result.LastInsertId()

	status := Status{
		ID:   id,
		Name: statusName,
	}

	return &status, nil
}

func (s statusRepositoryDB) GetAll() ([]Status, error) {
	var status []Status

	query := `
		SELECT 
			id,
			name
		FROM ticket_statuses
		WHERE deleted_at IS NULL
		ORDER BY id
	`

	err := s.db.Select(&status, query)
	if err != nil {
		return nil, err
	}

	return status, nil
}

func (s statusRepositoryDB) GetByID(id int) (*Status, error) {
	var status Status

	query := `
		SELECT 
			id,
			name
		FROM ticket_statuses
		WHERE id = ?
			AND deleted_at IS NULL
	`

	err := s.db.Get(&status, query, id)
	if err != nil {
		return nil, err
	}

	return &status, nil
}

func (s statusRepositoryDB) UpdateByID(id int, statusName string) (*Status, error) {
	query := `
		UPDATE ticket_statuses
		SET name = ?
		WHERE id = ?
			AND deleted_at IS NULL
	`

	_, err := s.db.Exec(query, statusName, id)
	if err != nil {
		return nil, err
	}

	return s.GetByID(id)
}

func (s statusRepositoryDB) DeleteByID(id int) error {
	var ticketCount int
	if err := s.db.Get(
		&ticketCount,
		"SELECT COUNT(1) FROM tickets WHERE status_id = ?",
		id,
	); err != nil {
		return err
	}
	if ticketCount > 0 {
		return fmt.Errorf("%w: ไม่สามารถลบสถานะได้ เนื่องจากยังมีรายการแจ้งซ่อมที่ใช้สถานะนี้อยู่", domain.ErrResourceInUse)
	}

	query := `
		UPDATE ticket_statuses
		SET deleted_at = NOW()
		WHERE id = ?
			AND deleted_at IS NULL
	`

	_, err := s.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}
