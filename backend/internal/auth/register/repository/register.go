package repository

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type RegisterRepository interface {
	Create(user *domain.User) error
}
