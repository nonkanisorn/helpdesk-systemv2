package handler

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/service"
)

type deviceInstanceHandler struct {
	deviceInstanceServ service.DeviceInstanceService
}

func NewDeviceInstanceHandler(deviceInstanceServ service.DeviceInstanceService) deviceInstanceHandler {
	return deviceInstanceHandler{deviceInstanceServ: deviceInstanceServ}
}

func (d deviceInstanceHandler) GetAllDeviceInstance(c *fiber.Ctx) error {
	deviceInstance, err := d.deviceInstanceServ.GetAllDeviceInstance()
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"result": deviceInstance})
}
