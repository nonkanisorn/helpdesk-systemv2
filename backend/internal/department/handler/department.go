package handler

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/department/service"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type departmentHandler struct {
	depServ service.DepartmentService
}

func NewDepartmentHandler(depServ service.DepartmentService) departmentHandler {
	return departmentHandler{depServ: depServ}
}

func (d departmentHandler) GetAllDepartments(c *fiber.Ctx) error {
	departments, err := d.depServ.GetAllDepartments()
	if err != nil {
		fmt.Println(err)
		return err
	}
	fmt.Println("handler", departments)
	return c.JSON((fiber.Map{
		"result": departments,
	}))
}

func (d departmentHandler) GetDepartmentByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return err
	}
	department, err := d.depServ.GetDepartmentByID(id)
	if err != nil {
		return err
	}
	return c.JSON(department)
}

func (d departmentHandler) CreateDepartments(c *fiber.Ctx) error {
	var departmentrequest domain.DepartmentsRequest
	err := c.BodyParser(&departmentrequest)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = d.depServ.CreateDepartments(departmentrequest.DepName)
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

func (d departmentHandler) DeleteDepartmentsByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}
	err = d.depServ.DeleteDepartmentsByID(id)
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
