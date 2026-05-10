package repository

type Issue struct {
	ID        int    `db:"id"`
	IssueName string `db:"issue_name"`
}
type IssueRepository interface {
	GetAll() ([]Issue, error)
}
