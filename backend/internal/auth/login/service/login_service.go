package service

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/nonkanisorn/helpdesk-system/internal/auth/login/repository"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	permissionService "github.com/nonkanisorn/helpdesk-system/internal/permission/service"
	"golang.org/x/crypto/bcrypt"
)

type loginService struct {
	loginRepo      repository.LoginRepository
	permissionServ permissionService.PermissionService
}

func NewLoginService(loginRepo repository.LoginRepository, permissionServ permissionService.PermissionService) LoginService {
	return loginService{loginRepo: loginRepo, permissionServ: permissionServ}
}

//	func (l loginService) Login(username string, password string) (*domain.User, *string, error) {
//		user, err := l.loginRepo.GetByUsername(username)
//		if err != nil {
//			fmt.Println("no username")
//			return nil, nil, err
//		}
//		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
//		if err != nil {
//			fmt.Println("not compare")
//			return nil, nil, err
//		}
//		claims := jwt.MapClaims{
//			"fistname": user.FirstName,
//			"lastname": user.LastName,
//			"role_id":  user.RoleID,
//			"exp":      time.Now().Add(time.Hour * 72).Unix(),
//		}
//		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
//		t, err := token.SignedString([]byte("secret"))
//		if err != nil {
//			return nil, nil, err
//		}
//		fmt.Println("login success")
//		return user, &t, nil
//	}
func (l loginService) Login(email string, password string) (*domain.User, *string, error) {
	fmt.Println("serv", email)
	user, err := l.loginRepo.GetByEmail(email)
	if err != nil {
		fmt.Println("no email")
		return nil, nil, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		fmt.Println("not compare")
		return nil, nil, err
	}

	permissions, err := l.permissionServ.GetPermissionNamesByRoleID(user.RoleID)
	if err != nil {
		return nil, nil, err
	}
	user.Permissions = permissions

	claims := jwt.MapClaims{
		"user_id":    user.ID,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"role_id":    user.RoleID,
		"exp":        time.Now().Add(time.Hour * 72).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return nil, nil, err
	}

	fmt.Println("login success")
	return user, &t, nil
}
