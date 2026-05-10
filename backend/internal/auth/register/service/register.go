package service

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type RegisterService interface {
	CreateUser(user *domain.User) error
}
