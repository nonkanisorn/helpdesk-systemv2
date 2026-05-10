package service

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/nonkanisorn/helpdesk-system/internal/auth/login/repository"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

type loginService struct {
	loginRepo repository.LoginRepository
}

func NewLoginService(loginRepo repository.LoginRepository) LoginService {
	return loginService{loginRepo: loginRepo}
}

func (l loginService) Login(username string, password string) (*domain.User, *string, error) {
	user, err := l.loginRepo.GetByUsername(username)
	if err != nil {
		fmt.Println("no username")
		return nil, nil, err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		fmt.Println("not compare")
		return nil, nil, err
	}
	claims := jwt.MapClaims{
		"fistname": user.FirstName,
		"lastname": user.LastName,
		"role_id":  user.RoleID,
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return nil, nil, err
	}
	fmt.Println("login success")
	return user, &t, nil
}
