package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/user/service"
)

type userQueryHandler struct {
	userQueryService service.UserQueryService
}

func NewUserQueryHandler(userQueryService service.UserQueryService) userQueryHandler {
	return userQueryHandler{userQueryService: userQueryService}
}

func (u userQueryHandler) GetUserWithRolesName(c *fiber.Ctx) error {
	users, err := u.userQueryService.GetUserWithRolesName()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"result":  users,
	})
}

func (u userQueryHandler) GetCurrentUser(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err})
	}
	user, err := u.userQueryService.GetCurrentUser(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"result":  user,
	})
}

func (u userQueryHandler) GetUserByRolesID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("roleID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	userTech, err := u.userQueryService.GetUserByRolesID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"result":  userTech,
	})
}
