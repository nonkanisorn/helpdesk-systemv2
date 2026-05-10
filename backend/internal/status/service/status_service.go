package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/status/repository"
)

type statusService struct {
	statusRepo repository.StatusRepository
}

func NewStatusService(statusRepo repository.StatusRepository) statusService {
	return statusService{statusRepo: statusRepo}
}

func (s statusService) CreateStatus(StatusName string) (*StatusResponse, error) {
	status, err := s.statusRepo.Create(StatusName)
	if err != nil {
		return nil, err
	}
	return &StatusResponse{
		status.StatusID,
		status.StatusName,
	}, nil
}

func (s statusService) GetStatusAll() ([]StatusResponse, error) {
	status, err := s.statusRepo.GetAll()
	if err != nil {
		return nil, err
	}
	var statusResponses []StatusResponse
	for _, status := range status {
		statusRespose := StatusResponse{
			StatusID:   status.StatusID,
			StatusName: status.StatusName,
		}
		statusResponses = append(statusResponses, statusRespose)
	}

	return statusResponses, nil
}

func (s statusService) GetStatusByID(id int) (*StatusResponse, error) {
	return nil, nil
}

func (s statusService) DeleteStatusByID(id int) error {
	err := s.statusRepo.DeleteByID(id)
	if err != nil {
		return err
	}
	return nil
}
