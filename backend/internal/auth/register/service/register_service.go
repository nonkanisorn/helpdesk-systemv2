package service

import (

	// "github.com/golang-jwt/jwt/v5"
	"github.com/nonkanisorn/helpdesk-system/internal/auth/register/repository"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

type registerService struct {
	registerRepo repository.RegisterRepository
}

func NewRegisterService(registerRepo repository.RegisterRepository) RegisterService {
	return registerService{registerRepo: registerRepo}
}

func (r registerService) CreateUser(user *domain.User) error {
	// fmt.Println("user", user)
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		return err
	}
	// fmt.Println("hash", string(passwordHash))
	user.Password = string(passwordHash)
	err = r.registerRepo.Create(user)
	if err != nil {
		return err
	}
	return nil
}
