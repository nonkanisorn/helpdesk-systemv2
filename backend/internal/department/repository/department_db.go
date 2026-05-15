package repository

import "github.com/jmoiron/sqlx"

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

func (d departmentRepositoryDB) DeleteByID(id int) error {
	query := `
		DELETE FROM departments
		WHERE id = ?
	`

	_, err := d.db.Exec(query, id)
	if err != nil {
		return err
	}

	return nil
}
