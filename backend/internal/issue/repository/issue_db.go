package repository

import "github.com/jmoiron/sqlx"

type issueRepositoryDB struct {
	db *sqlx.DB
}

func NewIssueRepository(db *sqlx.DB) IssueRepository {
	return issueRepositoryDB{db: db}
}

func (i issueRepositoryDB) GetAll() ([]Issue, error) {
	var issues []Issue

	query := `
		SELECT 
			id,
			name
		FROM issue_categories
		WHERE deleted_at IS NULL
		ORDER BY id
	`

	err := i.db.Select(&issues, query)
	if err != nil {
		return nil, err
	}

	return issues, nil
}

func (i issueRepositoryDB) Create(issueName string) error {
	query := `
		INSERT INTO issue_categories (name)
		VALUES (?)
	`

	_, err := i.db.Exec(query, issueName)
	if err != nil {
		return err
	}

	return nil
}

func (i issueRepositoryDB) UpdateByID(id int, issueName string) error {
	query := `
		UPDATE issue_categories
		SET name = ?
		WHERE id = ?
			AND deleted_at IS NULL
	`

	_, err := i.db.Exec(query, issueName, id)
	if err != nil {
		return err
	}

	return nil
}

func (i issueRepositoryDB) DeleteByID(id int) error {
	query := `
		UPDATE issue_categories
		SET deleted_at = NOW()
		WHERE id = ?
			AND deleted_at IS NULL
	`

	_, err := i.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}
