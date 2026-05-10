package handler

import (
	"log"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"github.com/nonkanisorn/helpdesk-system/internal/role/service"
)

type roleHandler struct {
	roleSrv service.RoleService
}

func NewRoleHandler(roleSrv service.RoleService) roleHandler {
	return roleHandler{roleSrv: roleSrv}
}

func (h roleHandler) GetRole(c *fiber.Ctx) error {
	roles, err := h.roleSrv.GetRole()
	if err != nil {
		log.Println(err)
		return err
	}
	return c.JSON(roles)
}

func (h roleHandler) GetRoleByID() fiber.Handler {
	return func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			log.Println(err)
		}
		roles, err := h.roleSrv.GetRoleByID(id)
		if err != nil {
			log.Println(err)
		}
		return c.JSON(roles)
	}
}

func (r roleHandler) CreateRoles(c *fiber.Ctx) error {
	var roleRequest domain.CreateRolesRequest
	err := c.BodyParser(&roleRequest)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	// fmt.Printf("%#v", roleName)
	err = r.roleSrv.CreateRoles(roleRequest.RoleName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func (r roleHandler) DeleteRolesByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	err = r.roleSrv.DeleteRolesByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusNoContent).JSON(fiber.Map{"success": true})
}
