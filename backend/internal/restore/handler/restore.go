package handler

import (
	"database/sql"
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/restore/repository"
	"github.com/nonkanisorn/helpdesk-system/internal/restore/service"
)

type restoreHandler struct {
	restoreServ service.RestoreService
}

func NewRestoreHandler(restoreServ service.RestoreService) restoreHandler {
	return restoreHandler{restoreServ: restoreServ}
}

func (h restoreHandler) GetDeletedItems(c *fiber.Ctx) error {
	items, err := h.restoreServ.GetDeletedItems()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{"result": items})
}

func (h restoreHandler) GetDeletedDeviceItems(c *fiber.Ctx) error {
	items, err := h.restoreServ.GetDeletedDeviceItems()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{"result": items})
}

func (h restoreHandler) Restore(c *fiber.Ctx) error {
	resourceType := c.Params("resource")
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	if err := h.restoreServ.Restore(resourceType, id); err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "ไม่พบข้อมูลที่ถูกลบ หรือข้อมูลนี้ถูกกู้คืนแล้ว",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
	})
}

func (h restoreHandler) RestoreDeviceItem(c *fiber.Ctx) error {
	resourceType := c.Params("resource")
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid id",
		})
	}

	if err := h.restoreServ.RestoreDeviceItem(resourceType, id); err != nil {
		if errors.Is(err, repository.ErrUnsupportedRestoreResource) {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "กู้คืนได้เฉพาะข้อมูลอุปกรณ์เท่านั้น",
			})
		}
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "ไม่พบข้อมูลที่ถูกลบ หรือข้อมูลนี้ถูกกู้คืนแล้ว",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
	})
}
