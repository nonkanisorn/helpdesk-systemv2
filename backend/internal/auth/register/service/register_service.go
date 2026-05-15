package service

import (

	// "github.com/golang-jwt/jwt/v5"

	"crypto/sha256"
	"encoding/hex"
	"fmt"

	"github.com/nonkanisorn/helpdesk-system/internal/auth/register/repository"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"github.com/nonkanisorn/helpdesk-system/internal/gomail/service"
	"golang.org/x/crypto/bcrypt"
)

type registerService struct {
	registerRepo  repository.RegisterRepository
	gomailService service.GomailService
}

func NewRegisterService(
	registerRepo repository.RegisterRepository,
	gomailService service.GomailService,
) RegisterService {
	return registerService{
		registerRepo:  registerRepo,
		gomailService: gomailService,
	}
}

func (r registerService) CreateUser(user *domain.User) error {
	// fmt.Println("user", user)
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), 10)
	if err != nil {
		return err
	}
	// fmt.Println("hash", string(passwordHash))
	user.PasswordHash = string(passwordHash)
	err = r.registerRepo.Create(user)
	if err != nil {
		return err
	}
	return nil
}

func (r registerService) CreateTest(users *domain.Usertest) error {
	// fmt.Println("from service createtest ", users)
	lastID, err := r.registerRepo.CreateTest(users)
	if err != nil {
		return err
	}
	rawToken, err := r.gomailService.SendEmailRegister(*users.Email)
	if err != nil {
		return err
	}

	hashToken := sha256.Sum256([]byte(*rawToken))
	hashedToken := hex.EncodeToString(hashToken[:])
	err = r.registerRepo.SaveToken(lastID, hashedToken)
	if err != nil {
		return err
	}
	return nil
}

func (r registerService) SetPassword(users *domain.Usertest, rawToken string) error {
	hash := sha256.Sum256([]byte(rawToken))
	hashedToken := hex.EncodeToString(hash[:])
	user, err := r.registerRepo.CheckToken(hashedToken)
	if err != nil {
		return err
	}

	fmt.Printf("%+v", *users.PasswordHash)

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(*users.PasswordHash), 10)
	if err != nil {
		return err
	}
	// fmt.Println(passwordHash)
	users.UserID = user.UserID
	*users.PasswordHash = string(passwordHash)
	// fmt.Println(*users.Password)
	fmt.Println(*users.UserID)
	fmt.Println("usesrs", users)
	err = r.registerRepo.SetPassword(users)
	if err != nil {
		return err
	}
	return nil
}
