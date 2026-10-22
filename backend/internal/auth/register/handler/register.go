package handler

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/auth/register/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type registerHandler struct {
	registerServ service.RegisterService
}

func NewRegisterHandler(registerServ service.RegisterService) registerHandler {
	return registerHandler{registerServ: registerServ}
}

// func (r registerHandler) CreateUser(c *fiber.Ctx) error {
// 	var user domain.User
// 	err := c.BodyParser(&user)
// 	if err != nil {
// 		fmt.Println(err)
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
// 	}
// 	if err = r.registerServ.CreateUser(&user); err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
// 	}
// 	return c.Status(fiber.StatusOK).SendString("success")
// }

func (r registerHandler) CreateUser(c *fiber.Ctx) error {
	var user domain.Usertest
	err := c.BodyParser(&user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	if err = r.registerServ.CreateTest(&user); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	return c.Status(fiber.StatusOK).SendString("success")
}

func (r registerHandler) SetPassword(c *fiber.Ctx) error {
	var req domain.Usertest
	err := c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = r.registerServ.SetPassword(&req, *req.TokenHash)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

func (r registerHandler) RequestPasswordReset(c *fiber.Ctx) error {
	var req struct {
		Email string `json:"email"`
	}

	err := c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	email := strings.TrimSpace(req.Email)
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "กรุณากรอกอีเมล"})
	}

	err = r.registerServ.RequestPasswordReset(email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "หากพบอีเมลในระบบ ระบบได้ส่งลิงก์ดำเนินการให้เรียบร้อยแล้ว",
	})
}

func (r registerHandler) VerifyToken(c *fiber.Ctx) error {
	token := strings.TrimSpace(c.Params("token"))
	if token == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"valid": false,
			"error": "ไม่พบ token สำหรับตั้งรหัสผ่าน",
		})
	}

	result, err := r.registerServ.VerifyToken(token)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"valid": false,
			"error": "ลิงก์นี้ไม่ถูกต้อง หมดอายุ หรือถูกใช้งานไปแล้ว",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"valid": true,
		"mode":  result.Mode,
		"email": result.Email,
	})
}
