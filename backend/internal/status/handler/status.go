package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/status/service"
)

type statusHandler struct {
	statusServ service.StatusService
}

type StatusRequest struct {
	StatusID   int
	StatusName string `json:"status_name"`
}

func NewStatusHandler(statusServ service.StatusService) statusHandler {
	return statusHandler{statusServ: statusServ}
}

func (s statusHandler) CreateStatus(c *fiber.Ctx) error {
	var statusRequset StatusRequest
	err := c.BodyParser(&statusRequset)
	if err != nil {
		return err
	}
	status, err := s.statusServ.CreateStatus(statusRequset.StatusName)
	if err != nil {
		return err
	}
	return c.JSON(status)
}

func (s statusHandler) GetStatusAll(c *fiber.Ctx) error {
	status, err := s.statusServ.GetStatusAll()
	if err != nil {
		return err
	}
	return c.JSON(status)
}

func (s statusHandler) DeleteStatusByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return err
	}
	err = s.statusServ.DeleteStatusByID(id)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusNoContent)
}
