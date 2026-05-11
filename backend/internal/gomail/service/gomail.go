package service

type GomailService interface {
	SendEmailRegister(to string) (*string, error)
}
