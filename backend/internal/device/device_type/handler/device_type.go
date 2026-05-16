package handler

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/device/device_type/service"
)

type deviceTypeHandler struct {
	deviceTypeServ service.DeviceTypeService
}

func NewDeviceTypeHandler(deviceTypeServ service.DeviceTypeService) deviceTypeHandler {
	return deviceTypeHandler{deviceTypeServ: deviceTypeServ}
}

func (d deviceTypeHandler) GetAllDeviceTypes(c *fiber.Ctx) error {
	deviceTypes, err := d.deviceTypeServ.GetAllDeviceType()
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(deviceTypes)
}

type deviceTypeRequest struct {
	DeviceTypeName string `json:"devicetype_name"`
}

func (d deviceTypeHandler) CreateDeviceType(c *fiber.Ctx) error {
	var req deviceTypeRequest
	err := c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = d.deviceTypeServ.CreateDeviceType(req.DeviceTypeName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"success": true})
}

func (d deviceTypeHandler) UpdateDeviceTypeByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	var req deviceTypeRequest
	err = c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = d.deviceTypeServ.UpdateDeviceTypeByID(id, req.DeviceTypeName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"success": true})
}

func (d deviceTypeHandler) DeleteDeviceTypeByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = d.deviceTypeServ.DeleteDeviceTypeByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
