package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type TokenVerifyResponse struct {
	Valid bool   `json:"valid"`
	Mode  string `json:"mode"`
	Email string `json:"email"`
}

type RegisterService interface {
	CreateUser(user *domain.User) error
	CreateTest(user *domain.Usertest) error
	SetPassword(user *domain.Usertest, token string) error
	RequestPasswordReset(email string) error
	VerifyToken(rawToken string) (*TokenVerifyResponse, error)
	ResendInitialPassword(userID int, email string) error
}
