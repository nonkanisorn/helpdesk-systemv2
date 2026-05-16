package service

type IssueResponse struct {
	ID   int    `db:"id" json:"issues_id"`
	Name string `db:"name" json:"issues_name"`
}
type IssueService interface {
	GetAllIssues() ([]IssueResponse, error)
	CreateIssue(string) error
	UpdateIssueByID(int, string) error
	DeleteIssueByID(int) error
}
