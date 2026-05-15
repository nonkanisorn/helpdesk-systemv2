package repository

type Issue struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
}
type IssueRepository interface {
	GetAll() ([]Issue, error)
}
