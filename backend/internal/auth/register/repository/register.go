package repository

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type RegisterRepository interface {
	Create(user *domain.User) error
	CreateTest(user *domain.Usertest) (*int, error)
	SetPassword(user *domain.Usertest) error
	CheckToken(token string) (*domain.Usertest, error)
	SaveToken(userID *int, token string) error
	FindUserIDByEmail(email string) (*int, error)
	MarkTokenUsed(token string) error
}
