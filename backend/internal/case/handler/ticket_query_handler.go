package handler

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	jwt "github.com/golang-jwt/jwt/v5"
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

func getUserInfoFromCtx(c *fiber.Ctx) (int, string) {
	token, ok := c.Locals("user").(*jwt.Token)
	if !ok || token == nil {
		return 0, ""
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, ""
	}
	userID := 0
	if id, ok := claims["user_id"].(float64); ok {
		userID = int(id)
	}
	first, _ := claims["first_name"].(string)
	last, _ := claims["last_name"].(string)
	name := strings.TrimSpace(first + " " + last)
	return userID, name
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

	_, userName := getUserInfoFromCtx(c)
	reason := ""
	if ticketReq.Reason != nil {
		reason = *ticketReq.Reason
	}

	managerID := 0
	if ticketReq.ManagerID != nil {
		managerID = *ticketReq.ManagerID
	}

	technicianID := 0
	if ticketReq.TechnicianID != nil {
		technicianID = *ticketReq.TechnicianID
	}

	err = t.ticketQueryServ.AssignTechToTicket(technicianID, managerID, id, userName, reason)
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

func (t ticketsQueryHandler) UnableToWorkByTechnician(c *fiber.Ctx) error {
	ticketID, err := strconv.Atoi(c.Params("ticketID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	var req domain.TechnicianUnableToWorkRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	userID, userName := getUserInfoFromCtx(c)
	var techID *int
	if userID > 0 {
		techID = &userID
	}

	err = t.ticketQueryServ.UnableToWorkByTechnician(ticketID, techID, userName, req.Reason)
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
		status := fiber.StatusInternalServerError
		if errors.Is(err, domain.ErrDeviceSerialNotFound) || errors.Is(err, domain.ErrDeviceUnavailable) {
			status = fiber.StatusUnprocessableEntity
		}
		return c.Status(status).JSON(fiber.Map{
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

func (t ticketsQueryHandler) RejectRepairByUser(c *fiber.Ctx) error {
	ticketID, err := strconv.Atoi(c.Params("ticketID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	var req domain.UserRejectRepairRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "ข้อมูลไม่ถูกต้อง",
		})
	}

	trimmedReason := strings.TrimSpace(req.Reason)
	if trimmedReason == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "กรุณาระบุเหตุผลที่ไม่ยอมรับผลการซ่อม",
		})
	}

	userID, userName := getUserInfoFromCtx(c)
	var uID *int
	if userID > 0 {
		uID = &userID
	}

	err = t.ticketQueryServ.RejectRepairByUser(ticketID, uID, userName, trimmedReason)
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

func (t ticketsQueryHandler) GetTicketDetailByID(c *fiber.Ctx) error {
	ticketID, err := strconv.Atoi(c.Params("ticketID"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	tickets, err := t.ticketQueryServ.GetTicketDetailByID(ticketID)
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
