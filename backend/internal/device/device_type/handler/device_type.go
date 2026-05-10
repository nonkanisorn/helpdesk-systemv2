package handler

import (
	"fmt"

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
