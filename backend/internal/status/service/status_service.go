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

func (s statusService) CreateStatus(statusName string) (*StatusResponse, error) {
	status, err := s.statusRepo.Create(statusName)
	if err != nil {
		return nil, err
	}

	return &StatusResponse{
		ID:   status.ID,
		Name: status.Name,
	}, nil
}

func (s statusService) GetStatusAll() ([]StatusResponse, error) {
	statuses, err := s.statusRepo.GetAll()
	if err != nil {
		return nil, err
	}

	var statusResponses []StatusResponse

	for _, status := range statuses {
		statusResponse := StatusResponse{
			ID:   status.ID,
			Name: status.Name,
		}

		statusResponses = append(statusResponses, statusResponse)
	}

	return statusResponses, nil
}

func (s statusService) GetStatusByID(id int) (*StatusResponse, error) {
	status, err := s.statusRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	return &StatusResponse{
		ID:   status.ID,
		Name: status.Name,
	}, nil
}

func (s statusService) DeleteStatusByID(id int) error {
	err := s.statusRepo.DeleteByID(id)
	if err != nil {
		return err
	}

	return nil
}
