package service

import "time"

type DeletedItemResponse struct {
	ResourceType  string     `json:"resource_type"`
	ResourceLabel string     `json:"resource_label"`
	ID            int        `json:"id"`
	Name          string     `json:"name"`
	Description   *string    `json:"description"`
	DeletedAt     *time.Time `json:"deleted_at"`
}

type RestoreService interface {
	GetDeletedItems() ([]DeletedItemResponse, error)
	GetDeletedDeviceItems() ([]DeletedItemResponse, error)
	Restore(resourceType string, id int) error
	RestoreDeviceItem(resourceType string, id int) error
}
