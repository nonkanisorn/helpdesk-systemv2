package service

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"strconv"
	"strings"

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
	return g.sendPasswordEmail(to, "ตั้งรหัสผ่านสำหรับ Helpdesk", "กรุณาตั้งรหัสผ่านสำหรับเข้าใช้งานระบบ Helpdesk")
}

func (g gomailService) SendEmailResetPassword(to string) (*string, error) {
	return g.sendPasswordEmail(to, "รีเซ็ตรหัสผ่าน Helpdesk", "เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ")
}

func (g gomailService) sendPasswordEmail(to string, subject string, intro string) (*string, error) {
	token, err := GenerateToken()
	if err != nil {
		return nil, err
	}

	smtpHost := getEnv("MAIL_SMTP_HOST", "smtp.gmail.com")
	smtpPort := getEnvInt("MAIL_SMTP_PORT", 587)
	senderEmail := getEnv("GMAIL_EMAIL", os.Getenv("MAIL_FROM"))
	senderPassword := normalizePassword(getEnv("GMAIL_APP_PASSWORD", os.Getenv("MAIL_PASSWORD")))
	frontendURL := getEnv("FRONTEND_URL", "http://localhost:5173")

	if senderEmail == "" {
		return nil, fmt.Errorf("missing GMAIL_EMAIL or MAIL_FROM environment variable")
	}

	if senderPassword == "" {
		return nil, fmt.Errorf("missing GMAIL_APP_PASSWORD or MAIL_PASSWORD environment variable")
	}

	link := fmt.Sprintf("%s/set-password/%s", frontendURL, token)
	message := mail.NewMsg()
	if err := message.From(senderEmail); err != nil {
		return nil, err
	}
	if err := message.To(to); err != nil {
		return nil, err
	}
	message.Subject(subject)
	body := fmt.Sprintf(`
		<h2>%s</h2>
		<p>%s</p>
		<p><a href="%s">คลิกเพื่อตั้งรหัสผ่านใหม่</a></p>
		<p>หากคุณไม่ได้เป็นผู้ขอ สามารถละเว้นอีเมลนี้ได้</p>
	`, subject, intro, link)
	message.SetBodyString(mail.TypeTextHTML, body)
	client, err := mail.NewClient(smtpHost, mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithPort(smtpPort), mail.WithUsername(senderEmail), mail.WithPassword(senderPassword))
	if err != nil {
		return nil, err
	}
	if err := client.DialAndSend(message); err != nil {
		return nil, err
	}

	return &token, nil
}

func getEnv(key string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value != "" {
		return value
	}

	return strings.TrimSpace(fallback)
}

func getEnvInt(key string, fallback int) int {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}

	return parsed
}

func normalizePassword(password string) string {
	return strings.ReplaceAll(strings.TrimSpace(password), " ", "")
}
