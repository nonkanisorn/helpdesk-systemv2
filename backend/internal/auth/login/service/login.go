package service

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type LoginService interface {
	Login(string, string) (*domain.User, *string, error)
}
