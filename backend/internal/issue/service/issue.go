package service

type IssueResponse struct {
	ID        int    `db:"id" json:"issues_id"`
	IssueName string `db:"issue_name" json:"issues_name"`
}
type IssueService interface {
	GetAllIssues() ([]IssueResponse, error)
}
