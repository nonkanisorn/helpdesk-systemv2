package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	permissionService "github.com/nonkanisorn/helpdesk-system/internal/permission/service"
)

type PermissionHandler struct {
	permissionServ permissionService.PermissionService
}

type UpdateRolePermissionsRequest struct {
	PermissionIDs []int    `json:"permission_ids"`
	Permissions   []string `json:"permissions"`
}

func NewPermissionHandler(permissionServ permissionService.PermissionService) PermissionHandler {
	return PermissionHandler{permissionServ: permissionServ}
}

func (p PermissionHandler) GetAllPermissions(c *fiber.Ctx) error {
	permissions, err := p.permissionServ.GetAllPermissions()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"result":  permissions,
	})
}

func (p PermissionHandler) GetRolePermissions(c *fiber.Ctx) error {
	roleID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	permissions, err := p.permissionServ.GetPermissionsByRoleID(roleID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"result":  permissions,
	})
}

func (p PermissionHandler) UpdateRolePermissions(c *fiber.Ctx) error {
	roleID, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	req := UpdateRolePermissionsRequest{}
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	if len(req.Permissions) > 0 {
		err = p.permissionServ.SetRolePermissionsByNames(roleID, req.Permissions)
	} else {
		err = p.permissionServ.SetRolePermissions(roleID, req.PermissionIDs)
	}
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	return c.JSON(fiber.Map{"success": true})
}
