package handler

import (
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
