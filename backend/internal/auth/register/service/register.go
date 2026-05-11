package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type RegisterService interface {
	CreateUser(user *domain.User) error
	CreateTest(user *domain.Usertest) error
	SetPassword(user *domain.Usertest, token string) error
}
