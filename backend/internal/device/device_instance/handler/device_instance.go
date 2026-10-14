package handler

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
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

func (d deviceInstanceHandler) Create(c *fiber.Ctx) error {
	var req domain.DeviceInstanceCreateRequest
	err := c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err,
		})
	}
	departmentID := req.DepartmentID
	if departmentID == nil {
		departmentID = req.DepartmentIDAlias
	}

	err = d.deviceInstanceServ.Create(req.DeviceID,
		departmentID,
		req.SerialNumber)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

func (d deviceInstanceHandler) UpdateDeviceInstanceByID(c *fiber.Ctx) error {
	instanceID, err := strconv.Atoi(c.Params("instanceID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	var req domain.DeviceInstanceCreateRequest
	err = c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	departmentID := req.DepartmentID
	if departmentID == nil {
		departmentID = req.DepartmentIDAlias
	}

	status := req.Status
	if status != "inactive" {
		status = "active"
	}

	err = d.deviceInstanceServ.UpdateDeviceInstanceByID(instanceID, departmentID, req.SerialNumber, status)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}

func (d deviceInstanceHandler) DeleteDeviceInstanceByID(c *fiber.Ctx) error {
	instanceID, err := strconv.Atoi(c.Params("instanceID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err,
		})
	}

	err = d.deviceInstanceServ.DeleteDeviceInstanceByID(instanceID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}
