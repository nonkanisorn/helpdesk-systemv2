package repository

import (
	"errors"
	"time"
)

var ErrUnsupportedRestoreResource = errors.New("unsupported restore resource")

type DeletedItem struct {
	ResourceType  string     `db:"resource_type" json:"resource_type"`
	ResourceLabel string     `db:"resource_label" json:"resource_label"`
	ID            int        `db:"id" json:"id"`
	Name          string     `db:"name" json:"name"`
	Description   *string    `db:"description" json:"description"`
	DeletedAt     *time.Time `db:"deleted_at" json:"deleted_at"`
}

type RestoreRepository interface {
	GetDeletedItems() ([]DeletedItem, error)
	Restore(resourceType string, id int) error
}
