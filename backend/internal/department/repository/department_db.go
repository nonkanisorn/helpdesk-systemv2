package repository

import "github.com/jmoiron/sqlx"

type departmentRepositoryDB struct {
	db *sqlx.DB
}

func NewDepartmentRepositoryDB(db *sqlx.DB) DepartmentRepository {
	return departmentRepositoryDB{db: db}
}

type departmentRow struct {
	DepartmentID   int64  `db:"dep_id"`
	DepartmentName string `db:"dep_name"`
}

func (d departmentRepositoryDB) GetAll() ([]Department, error) {
	department := []Department{}
	query := "select dep_id, dep_name from departments"
	err := d.db.Select(&department, query)
	if err != nil {
		return nil, err
	}
	return department, nil
}

func (d departmentRepositoryDB) GetByID(id int) (*Department, error) {
	var department Department
	query := "select dep_id,dep_name from departments where dep_id = ? "
	row := d.db.QueryRow(query, id)
	err := row.Scan(&department.DepartmentID, &department.DepartmentName)
	if err != nil {
		return nil, err
	}
	return &department, nil
}

func (d departmentRepositoryDB) Create(departmentName string) error {
	// var departments departmentRow
	query := "insert into departments (dep_name) values (?)"
	_, err := d.db.Exec(query, departmentName)
	if err != nil {
		return err
	}
	return nil
}

func (d departmentRepositoryDB) DeleteByID(id int) error {
	query := "delete from departments where dep_id = ? "
	_, err := d.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
