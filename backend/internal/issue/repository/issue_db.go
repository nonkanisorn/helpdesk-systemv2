package repository

import (
	"github.com/jmoiron/sqlx"
)

type issueRepositoryDB struct {
	db *sqlx.DB
}

func NewIssueRepository(db *sqlx.DB) IssueRepository {
	return issueRepositoryDB{db: db}
}

func (i issueRepositoryDB) GetAll() ([]Issue, error) {
	var issues []Issue
	query := "select id,issue_name from issue_categories"
	err := i.db.Select(&issues, query)
	if err != nil {
		return nil, err
	}
	return issues, nil
}
