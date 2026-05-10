package repository

import (
	"log"

	"github.com/jmoiron/sqlx"
)

type statusRepositoryDB struct {
	db *sqlx.DB
}

func NewStatusRepositoryDB(db *sqlx.DB) statusRepositoryDB {
	return statusRepositoryDB{db: db}
}

func (s statusRepositoryDB) Create(StatusName string) (*Status, error) {
	query := "insert into status (status_name) values (?)"
	result, err := s.db.Exec(query, StatusName)
	if err != nil {
		return nil, err
	}
	id, _ := result.LastInsertId()
	status := Status{id, StatusName}
	return &status, nil
}

func (s statusRepositoryDB) GetAll() ([]Status, error) {
	var status []Status
	query := "select status_id,status_name from status"
	err := s.db.Select(&status, query)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	return status, nil
}

func (s statusRepositoryDB) GetByID(id int) (*Status, error) {
	query := "select status_id , status_name where status "
	_ = query
	return nil, nil
}

func (s statusRepositoryDB) DeleteByID(id int) error {
	query := "delete from status where status_id = ?"
	_, err := s.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
