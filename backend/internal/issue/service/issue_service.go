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
		issueForAppend := IssueResponse{
			ID:   issue.ID,
			Name: issue.Name,
		}

		issuesResponse = append(issuesResponse, issueForAppend)
	}

	return issuesResponse, nil
}

func (i issueService) CreateIssue(issueName string) error {
	return i.IssueRepo.Create(issueName)
}

func (i issueService) UpdateIssueByID(id int, issueName string) error {
	return i.IssueRepo.UpdateByID(id, issueName)
}

func (i issueService) DeleteIssueByID(id int) error {
	return i.IssueRepo.DeleteByID(id)
}
