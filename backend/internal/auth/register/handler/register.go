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
		fmt.Println(err)
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
	fmt.Println("req", req)

	err = r.registerServ.SetPassword(&req, *req.TokenHash)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	return nil
}
