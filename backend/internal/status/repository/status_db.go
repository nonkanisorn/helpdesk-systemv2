package repository

import "github.com/jmoiron/sqlx"

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
	`

	_, err := s.db.Exec(query, statusName, id)
	if err != nil {
		return nil, err
	}

	return s.GetByID(id)
}

func (s statusRepositoryDB) DeleteByID(id int) error {
	query := `
		DELETE FROM ticket_statuses
		WHERE id = ?
	`

	_, err := s.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}
