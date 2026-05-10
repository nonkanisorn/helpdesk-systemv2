package handler

import (
	"fmt"

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

func (r registerHandler) CreateUser(c *fiber.Ctx) error {
	var user domain.User
	err := c.BodyParser(&user)
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	if err = r.registerServ.CreateUser(&user); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	return c.Status(fiber.StatusOK).SendString("success")
}
