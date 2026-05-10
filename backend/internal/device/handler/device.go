package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/device/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type deviceHandler struct {
	deviceSrv service.DeviceService
}

func NewDeviceHandler(deviceSrv service.DeviceService) deviceHandler {
	return deviceHandler{deviceSrv: deviceSrv}
}

func (d deviceHandler) GetAllDevice(c *fiber.Ctx) error {
	device, err := d.deviceSrv.GetAllDevices()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(device)
}

func (d deviceHandler) CreateDevices(c *fiber.Ctx) error {
	var deviceRequest domain.DeviceRequset

	err := c.BodyParser(&deviceRequest)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	err = d.deviceSrv.CreateDevices(deviceRequest.DeviceName, deviceRequest.DeviceDescription, deviceRequest.DeviceType)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func (d deviceHandler) DeleteDevices(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err,
		})
	}
	err = d.deviceSrv.DeleteDevices(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}
