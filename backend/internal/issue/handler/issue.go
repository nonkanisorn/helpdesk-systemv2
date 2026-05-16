package handler

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/issue/service"
)

type issueHandler struct {
	issueServ service.IssueService
}

func NewIssueHandler(issueServ service.IssueService) issueHandler {
	return issueHandler{issueServ: issueServ}
}

func (s issueHandler) GetAllIssues(c *fiber.Ctx) error {
	issues, err := s.issueServ.GetAllIssues()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"result": issues,
	})
}

type issueRequest struct {
	IssuesName string `json:"issues_name"`
}

func (s issueHandler) CreateIssue(c *fiber.Ctx) error {
	var req issueRequest
	err := c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = s.issueServ.CreateIssue(req.IssuesName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"success": true})
}

func (s issueHandler) UpdateIssueByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	var req issueRequest
	err = c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = s.issueServ.UpdateIssueByID(id, req.IssuesName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"success": true})
}

func (s issueHandler) DeleteIssueByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = s.issueServ.DeleteIssueByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
