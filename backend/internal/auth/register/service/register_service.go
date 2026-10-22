package service

import (
	"crypto/sha256"
	"encoding/hex"

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

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(*users.PasswordHash), 10)
	if err != nil {
		return err
	}
	// fmt.Println(passwordHash)
	users.UserID = user.UserID
	*users.PasswordHash = string(passwordHash)

	err = r.registerRepo.SetPassword(users)
	if err != nil {
		return err
	}

	err = r.registerRepo.MarkTokenUsed(hashedToken)
	if err != nil {
		return err
	}

	return nil
}

func (r registerService) RequestPasswordReset(email string) error {
	user, err := r.registerRepo.FindUserByEmail(email)
	if err != nil {
		return err
	}

	if user == nil {
		return nil
	}

	// Check whether this user has not completed initial password setup
	isInvite := (user.Status != nil && *user.Status == "pending") ||
		(user.PasswordHash == nil || *user.PasswordHash == "")

	var rawToken *string
	if isInvite {
		rawToken, err = r.gomailService.SendEmailRegister(email)
	} else {
		rawToken, err = r.gomailService.SendEmailResetPassword(email)
	}
	if err != nil {
		return err
	}

	_ = r.registerRepo.InvalidateTokensByUserID(user.ID)

	hashToken := sha256.Sum256([]byte(*rawToken))
	hashedToken := hex.EncodeToString(hashToken[:])
	err = r.registerRepo.SaveToken(&user.ID, hashedToken)
	if err != nil {
		return err
	}

	return nil
}

func (r registerService) VerifyToken(rawToken string) (*TokenVerifyResponse, error) {
	hash := sha256.Sum256([]byte(rawToken))
	hashedToken := hex.EncodeToString(hash[:])
	user, err := r.registerRepo.VerifyTokenWithUser(hashedToken)
	if err != nil {
		return nil, err
	}

	mode := "reset"
	if (user.Status != nil && *user.Status == "pending") || (user.PasswordHash == nil || *user.PasswordHash == "") {
		mode = "invite"
	}

	email := ""
	if user.Email != nil {
		email = *user.Email
	}

	return &TokenVerifyResponse{
		Valid: true,
		Mode:  mode,
		Email: email,
	}, nil
}

func (r registerService) ResendInitialPassword(userID int, email string) error {
	_ = r.registerRepo.InvalidateTokensByUserID(userID)

	rawToken, err := r.gomailService.SendEmailRegister(email)
	if err != nil {
		return err
	}

	hashToken := sha256.Sum256([]byte(*rawToken))
	hashedToken := hex.EncodeToString(hashToken[:])
	return r.registerRepo.SaveToken(&userID, hashedToken)
}

