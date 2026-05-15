package service

type IssueResponse struct {
	ID   int    `db:"id" json:"issues_id"`
	Name string `db:"name" json:"issues_name"`
}
type IssueService interface {
	GetAllIssues() ([]IssueResponse, error)
}
