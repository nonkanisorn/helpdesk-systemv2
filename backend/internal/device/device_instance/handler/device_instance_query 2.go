package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/service"
)

type deviceInstanceQueryHandler struct {
	deviceInstanceQueryServ service.DeviceInstanceQueryService
}

func NewDeviceInstanceQueryHandler(deviceInstanceQueryServ service.DeviceInstanceQueryService) deviceInstanceQueryHandler {
	return deviceInstanceQueryHandler{deviceInstanceQueryServ: deviceInstanceQueryServ}
}

func (d deviceInstanceQueryHandler) GetDeviceInstanceByDeviceID(c *fiber.Ctx) error {
	deviceID, err := strconv.Atoi(c.Params("deviceID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	deviceInstances, err := d.deviceInstanceQueryServ.GetDeviceInstanceByDeviceID(deviceID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    deviceInstances,
	})
}

func (d deviceInstanceQueryHandler) GetHistoryRepairDeviceInstanceByDeviceInstanceID(c *fiber.Ctx) error {
	deviceInstanceID, err := strconv.Atoi(c.Params("deviceInstanceID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	deviceInstanceResponse, err := d.deviceInstanceQueryServ.GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    deviceInstanceResponse,
	})
}
