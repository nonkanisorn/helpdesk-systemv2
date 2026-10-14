package service

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"html"
	"os"
	"strconv"
	"strings"

	"github.com/wneessen/go-mail"
)

type gomailService struct{}

type passwordEmailContent struct {
	Subject       string
	Preheader     string
	Headline      string
	Intro         string
	Detail        string
	ButtonText    string
	Mode          string
	SecurityNote  string
	IgnoreMessage string
}

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
	return g.sendPasswordEmail(to, passwordEmailContent{
		Subject:       "ตั้งรหัสผ่านเพื่อเริ่มใช้งาน Helpdesk",
		Preheader:     "ตั้งรหัสผ่านครั้งแรกเพื่อเปิดใช้งานบัญชี Helpdesk ของคุณ",
		Headline:      "ยินดีต้อนรับสู่ Helpdesk",
		Intro:         "บัญชีผู้ใช้งานของคุณถูกสร้างเรียบร้อยแล้ว กรุณาตั้งรหัสผ่านครั้งแรกเพื่อเริ่มเข้าใช้งานระบบ",
		Detail:        "หลังจากตั้งรหัสผ่านสำเร็จ คุณสามารถเข้าสู่ระบบเพื่อติดตามงานแจ้งซ่อม ส่งคำขอใหม่ และดูสถานะการดำเนินการได้ทันที",
		ButtonText:    "ตั้งรหัสผ่านและเริ่มใช้งาน",
		Mode:          "invite",
		SecurityNote:  "เพื่อความปลอดภัย กรุณาอย่าส่งต่ออีเมลนี้ให้ผู้อื่น",
		IgnoreMessage: "หากคุณไม่ได้คาดว่าจะได้รับอีเมลนี้ กรุณาติดต่อผู้ดูแลระบบ",
	})
}

func (g gomailService) SendEmailResetPassword(to string) (*string, error) {
	return g.sendPasswordEmail(to, passwordEmailContent{
		Subject:       "รีเซ็ตรหัสผ่าน Helpdesk",
		Preheader:     "ใช้ลิงก์นี้เพื่อตั้งรหัสผ่านใหม่สำหรับบัญชี Helpdesk ของคุณ",
		Headline:      "ตั้งรหัสผ่านใหม่",
		Intro:         "เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชี Helpdesk ของคุณ",
		Detail:        "กดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่ แล้วกลับเข้าสู่ระบบด้วยรหัสผ่านที่เพิ่งตั้ง",
		ButtonText:    "ตั้งรหัสผ่านใหม่",
		Mode:          "reset",
		SecurityNote:  "หากคุณไม่ได้เป็นผู้ขอรีเซ็ตรหัสผ่าน บัญชีของคุณยังปลอดภัยตราบใดที่ไม่ได้กดลิงก์นี้",
		IgnoreMessage: "คุณสามารถละเว้นอีเมลนี้ได้",
	})
}

func (g gomailService) sendPasswordEmail(to string, content passwordEmailContent) (*string, error) {
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

	link := fmt.Sprintf("%s/set-password/%s?mode=%s", strings.TrimRight(frontendURL, "/"), token, content.Mode)
	message := mail.NewMsg()
	if err := message.From(senderEmail); err != nil {
		return nil, err
	}
	if err := message.To(to); err != nil {
		return nil, err
	}
	message.Subject(content.Subject)
	message.SetBodyString(mail.TypeTextPlain, buildPasswordEmailText(content, link))
	message.AddAlternativeString(mail.TypeTextHTML, buildPasswordEmailHTML(content, link))
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

func buildPasswordEmailText(content passwordEmailContent, link string) string {
	return fmt.Sprintf(`%s

%s

%s

%s

%s:
%s

%s
%s
`, content.Headline, content.Intro, content.Detail, content.ButtonText, "ลิงก์สำหรับดำเนินการ", link, content.SecurityNote, content.IgnoreMessage)
}

func buildPasswordEmailHTML(content passwordEmailContent, link string) string {
	escapedLink := html.EscapeString(link)

	return fmt.Sprintf(`<!doctype html>
<html lang="th">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>%s</title>
</head>
<body style="margin:0;background:#f4f7fb;color:#172033;font-family:Arial,'Noto Sans Thai',Tahoma,sans-serif;">
	<div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">%s</div>
	<table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
		<tr>
			<td align="center">
				<table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e3e8ef;border-radius:14px;overflow:hidden;">
					<tr>
						<td style="padding:28px 32px 20px;background:#123a6f;color:#ffffff;">
							<div style="font-size:14px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;">Helpdesk</div>
							<h1 style="margin:18px 0 0;font-size:24px;line-height:1.35;font-weight:700;">%s</h1>
						</td>
					</tr>
					<tr>
						<td style="padding:28px 32px 12px;">
							<p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#26364d;">%s</p>
							<p style="margin:0;font-size:15px;line-height:1.7;color:#526174;">%s</p>
						</td>
					</tr>
					<tr>
						<td style="padding:20px 32px 24px;">
							<a href="%s" style="display:inline-block;background:#1769e0;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;line-height:1.2;padding:14px 22px;border-radius:8px;">%s</a>
						</td>
					</tr>
					<tr>
						<td style="padding:0 32px 26px;">
							<div style="padding:14px 16px;background:#f7f9fc;border:1px solid #e7edf5;border-radius:8px;">
								<p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#5f6f85;">หากปุ่มไม่ทำงาน ให้คัดลอกลิงก์นี้ไปเปิดในเบราว์เซอร์</p>
								<a href="%s" style="font-size:13px;line-height:1.6;color:#1769e0;word-break:break-all;">%s</a>
							</div>
						</td>
					</tr>
					<tr>
						<td style="padding:20px 32px 28px;border-top:1px solid #edf1f6;">
							<p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:#526174;">%s</p>
							<p style="margin:0;font-size:13px;line-height:1.6;color:#7a8797;">%s</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`,
		html.EscapeString(content.Subject),
		html.EscapeString(content.Preheader),
		html.EscapeString(content.Headline),
		html.EscapeString(content.Intro),
		html.EscapeString(content.Detail),
		escapedLink,
		html.EscapeString(content.ButtonText),
		escapedLink,
		escapedLink,
		html.EscapeString(content.SecurityNote),
		html.EscapeString(content.IgnoreMessage),
	)
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
