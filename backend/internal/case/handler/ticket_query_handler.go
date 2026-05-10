package handler

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/case/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type ticketsQueryHandler struct {
	ticketQueryServ service.TicketQueryService
}

func NewTicketQueryHandlers(ticketQueryServ service.TicketQueryService) ticketsQueryHandler {
	return ticketsQueryHandler{ticketQueryServ: ticketQueryServ}
}

func (t ticketsQueryHandler) GetLatestTickets(c *fiber.Ctx) error {
	limit, err := strconv.Atoi(c.Params("limit", "2"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	userID, err := strconv.Atoi(c.Params("userID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	tickets, err := t.ticketQueryServ.GetLatestTickets(userID, limit)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"result":  tickets,
	})
}

func (t ticketsQueryHandler) GetTicketsByTechnicianID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	tickets, err := t.ticketQueryServ.GetTicketsByTechnicianID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"result":  tickets,
	})
}

func (t ticketsQueryHandler) UpdateStatusTicket(c *fiber.Ctx) error {
	updateStatusTicketReq := domain.UpdateTicketRequest{}
	fmt.Println(string(c.Body()))
	err := c.BodyParser(&updateStatusTicketReq)
	fmt.Println("parser", updateStatusTicketReq)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = t.ticketQueryServ.UpdateStatusTicket(&updateStatusTicketReq)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func (t ticketsQueryHandler) AssignTechToTicket(c *fiber.Ctx) error {
	var ticketReq domain.TicketsAssginTechRequest
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = c.BodyParser(&ticketReq)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = t.ticketQueryServ.AssignTechToTicket(*ticketReq.TechnicianID, *ticketReq.ManagerID, id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func (t ticketsQueryHandler) GetTicketForTechnicianByTicketID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("ticketID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	ticket, err := t.ticketQueryServ.GetTicketForTechnicianByTicketID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"result":  ticket,
	})
}

func (t ticketsQueryHandler) GetTicketsByStatusID(c *fiber.Ctx) error {
	// var statusID []int

	statusIDParams, err := strconv.Atoi(c.Params("statusID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	// return nil
	tickets, err := t.ticketQueryServ.GetTicketsByStatusID(statusIDParams)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"result":  tickets,
	})
}

func (t ticketsQueryHandler) GetTicketsByUsersID(c *fiber.Ctx) error {
	userID, err := strconv.Atoi(c.Params("userID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	tickets, err := t.ticketQueryServ.GetTicketsByUsersID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"result":  tickets,
	})
}

func (t ticketsQueryHandler) StartJobByTechnicianID(c *fiber.Ctx) error {
	ticketID, err := strconv.Atoi(c.Params("ticketID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = t.ticketQueryServ.StartJobByTechnicianID(ticketID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func (t ticketsQueryHandler) CompletedJobByTechnician(c *fiber.Ctx) error {
	var req domain.TicketCompleteRequest
	ticketID, err := strconv.Atoi(c.Params("ticketID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	err = c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = t.ticketQueryServ.CompletedJobByTechnician(ticketID, req.ResolutionNote, req.SerialNumber)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func (t ticketsQueryHandler) ConfirmAndCloseTicketByUser(c *fiber.Ctx) error {
	ticketID, err := strconv.Atoi(c.Params("ticketID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = t.ticketQueryServ.ConfirmAndCloseTicketByUser(ticketID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}

func (t ticketsQueryHandler) WaitingForPartByTechnicianID(c *fiber.Ctx) error {
	ticketID, err := strconv.Atoi(c.Params("ticketID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = t.ticketQueryServ.WaitingForPartByTechnicianID(ticketID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
	})
}
