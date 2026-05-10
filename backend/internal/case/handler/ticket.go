package handler

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/case/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type ticketHandler struct {
	tickerServ service.TicketService
	// ticketQueryServ service.TicketQueryService
}

func NewTicketHandler(ticketServ service.TicketService) *ticketHandler {
	return &ticketHandler{
		tickerServ: ticketServ,
		// ticketQueryServ: ticketQueryServ,
	}
}

func (t ticketHandler) GetTicketByID(c *fiber.Ctx) error {
	ticketID, err := strconv.Atoi(c.Params("ticketID"))
	fmt.Println("params", c.Params("ticketID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	ticket, err := t.tickerServ.GetTicketByID(ticketID)
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

func (t ticketHandler) CreateTicket(c *fiber.Ctx) error {
	ticketRequest := domain.CreateTicketRequest{}
	err := c.BodyParser(&ticketRequest)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = t.tickerServ.CreateTicket(&ticketRequest)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
	})
}

func (t ticketHandler) GetAllTickets(c *fiber.Ctx) error {
	tickets, err := t.tickerServ.GetAllTickets()
	fmt.Println("test")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"result":  tickets,
		"sssss":   "ssss,",
	})
}
