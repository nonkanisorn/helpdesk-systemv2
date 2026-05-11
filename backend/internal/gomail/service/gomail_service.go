package service

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"

	"github.com/wneessen/go-mail"
)

type gomailService struct{}

func NewGomailService() GomailService {
	return &gomailService{}
}

func GenerateToken() (string, error) {
	b := make([]byte, 32)

	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	return hex.EncodeToString(b), nil
}

func (g gomailService) SendEmailRegister(to string) (*string, error) {
	token, err := GenerateToken()
	if err != nil {
		return nil, err
	}
	link := fmt.Sprintf("http://localhost:5173/set-password/%s", token)
	message := mail.NewMsg()
	if err := message.From("kanisorn.kha@gmail.com"); err != nil {
		log.Fatalf("failed to set From address: %s", err)
	}
	if err := message.To("kanisorn.kha3@gmail.com"); err != nil {
		log.Fatalf("failed to set To address: %s", err)
	}
	message.Subject("This is my first mail with go-mail!")
	body := fmt.Sprintf("<h1>Hello form go<h1> <p>this is html type<p> <button>Click me <button> <a href=%s>link setpassword<a> ", link)
	message.SetBodyString(mail.TypeTextHTML, body)
	client, err := mail.NewClient("smtp.gmail.com", mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername("kanisorn.kha@gmail.com"), mail.WithPassword("gxqo dvdr vfii gedp"))
	if err != nil {
		log.Fatalf("failed to create mail client: %s", err)
	}
	if err := client.DialAndSend(message); err != nil {
		log.Fatalf("failed to send mail: %s", err)
	}

	return &token, nil
}
