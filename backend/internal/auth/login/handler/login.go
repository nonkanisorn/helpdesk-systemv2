package handler

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/auth/login/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type LoginHandler struct {
	loginServ service.LoginService
}

func NewLoginHandler(loginServ service.LoginService) LoginHandler {
	return LoginHandler{loginServ: loginServ}
}

func (l LoginHandler) Login(c *fiber.Ctx) error {
	var userRequest domain.UserRequest
	err := c.BodyParser(&userRequest)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}
	user, token, err := l.loginServ.Login(userRequest.UserName, userRequest.Password)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(err)
	}

	return c.JSON(fiber.Map{
		"user":  user,
		"token": token,
	})
}
