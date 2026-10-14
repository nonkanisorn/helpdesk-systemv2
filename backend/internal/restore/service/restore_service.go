package service

import "github.com/nonkanisorn/helpdesk-system/internal/restore/repository"

type restoreService struct {
	restoreRepo repository.RestoreRepository
}

func NewRestoreService(restoreRepo repository.RestoreRepository) RestoreService {
	return restoreService{restoreRepo: restoreRepo}
}

func (s restoreService) GetDeletedItems() ([]DeletedItemResponse, error) {
	items, err := s.restoreRepo.GetDeletedItems()
	if err != nil {
		return nil, err
	}

	return toDeletedItemResponses(items), nil
}

func (s restoreService) GetDeletedDeviceItems() ([]DeletedItemResponse, error) {
	items, err := s.restoreRepo.GetDeletedItems()
	if err != nil {
		return nil, err
	}

	deviceItems := make([]repository.DeletedItem, 0)
	for _, item := range items {
		if isDeviceRestoreResource(item.ResourceType) {
			deviceItems = append(deviceItems, item)
		}
	}

	return toDeletedItemResponses(deviceItems), nil
}

func toDeletedItemResponses(items []repository.DeletedItem) []DeletedItemResponse {
	responses := make([]DeletedItemResponse, 0, len(items))
	for _, item := range items {
		responses = append(responses, DeletedItemResponse{
			ResourceType:  item.ResourceType,
			ResourceLabel: item.ResourceLabel,
			ID:            item.ID,
			Name:          item.Name,
			Description:   item.Description,
			DeletedAt:     item.DeletedAt,
		})
	}

	return responses
}

func (s restoreService) Restore(resourceType string, id int) error {
	return s.restoreRepo.Restore(resourceType, id)
}

func (s restoreService) RestoreDeviceItem(resourceType string, id int) error {
	if !isDeviceRestoreResource(resourceType) {
		return repository.ErrUnsupportedRestoreResource
	}

	return s.restoreRepo.Restore(resourceType, id)
}

func isDeviceRestoreResource(resourceType string) bool {
	return resourceType == "devices" || resourceType == "device-instances"
}
