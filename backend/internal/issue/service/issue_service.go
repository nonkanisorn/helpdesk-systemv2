package service

import "github.com/nonkanisorn/helpdesk-system/internal/issue/repository"

type issueService struct {
	IssueRepo repository.IssueRepository
}

func NewIssueService(IssueRepo repository.IssueRepository) IssueService {
	return issueService{IssueRepo: IssueRepo}
}

func (i issueService) GetAllIssues() ([]IssueResponse, error) {
	issues, err := i.IssueRepo.GetAll()
	if err != nil {
		return nil, err
	}
	var issuesResponse []IssueResponse
	for _, issue := range issues {
		issueforappend := IssueResponse{
			ID:        issue.ID,
			IssueName: issue.IssueName,
		}
		issuesResponse = append(issuesResponse, issueforappend)

	}
	return issuesResponse, nil
}
