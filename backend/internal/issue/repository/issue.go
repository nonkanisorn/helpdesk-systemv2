package repository

type Issue struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
}
type IssueRepository interface {
	GetAll() ([]Issue, error)
	Create(string) error
	UpdateByID(int, string) error
	DeleteByID(int) error
}
