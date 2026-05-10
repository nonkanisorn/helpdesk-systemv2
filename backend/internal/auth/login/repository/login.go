package repository

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type User struct {
	UserName string
	Password string
}
type LoginRepository interface {
	GetByUsername(string) (*domain.User, error)
}
