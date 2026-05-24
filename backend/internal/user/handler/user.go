package handler

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	"github.com/nonkanisorn/helpdesk-system/internal/user/service"
)

type userHandler struct {
	userServ service.UserService
}

func NewUserHandler(userServ service.UserService) userHandler {
	return userHandler{userServ: userServ}
}

func userDeleteErrorResponse(err error) (int, fiber.Map) {
	message := "ไม่สามารถลบผู้ใช้นี้ได้ กรุณาลองใหม่อีกครั้ง"

	var mysqlErr *mysql.MySQLError
	if errors.As(err, &mysqlErr) {
		if mysqlErr.Number == 1451 || mysqlErr.Number == 1452 {
			message = "ไม่สามารถลบผู้ใช้นี้ได้ เนื่องจากยังมีข้อมูลที่ผูกกับผู้ใช้นี้อยู่"
			if strings.Contains(strings.ToLower(mysqlErr.Message), "user_invitation_tokens") {
				message = "ไม่สามารถลบผู้ใช้นี้ได้ เนื่องจากยังมีข้อมูลคำเชิญหรือลิงก์ตั้งรหัสผ่านที่ผูกกับผู้ใช้นี้อยู่"
			}

			return fiber.StatusConflict, fiber.Map{
				"error": message,
				"code":  "USER_HAS_RELATED_DATA",
			}
		}
	}

	errText := strings.ToLower(err.Error())
	if strings.Contains(errText, "foreign key") ||
		strings.Contains(errText, "constraint") {
		return fiber.StatusConflict, fiber.Map{
			"error": "ไม่สามารถลบผู้ใช้นี้ได้ เนื่องจากยังมีข้อมูลที่ผูกกับผู้ใช้นี้อยู่",
			"code":  "USER_HAS_RELATED_DATA",
		}
	}

	return fiber.StatusInternalServerError, fiber.Map{
		"error": message,
		"code":  "DELETE_USER_FAILED",
	}
}

func (u userHandler) GetAllUsers(c *fiber.Ctx) error {
	users, err := u.userServ.GetAllUsers()
	if err != nil {
		fmt.Println(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"result": users})
}

func (u userHandler) GetUserByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	user, err := u.userServ.GetUserByID(id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"result": user})
}

func (u userHandler) UpdateUserByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	var req domain.UserUpdateRequest
	err = c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = u.userServ.UpdateUserByID(id, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"success": true})
}

func (u userHandler) UpdateUserStatusByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	var req domain.UserUpdateRequest
	err = c.BodyParser(&req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	status := req.Status
	if status == "" {
		if req.IsActive != nil && *req.IsActive == 0 {
			status = "inactive"
		} else {
			status = "active"
		}
	}

	err = u.userServ.UpdateUserStatusByID(id, status)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"success": true})
}

func (u userHandler) DeleteUsersByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "รหัสผู้ใช้ไม่ถูกต้อง"})
	}
	err = u.userServ.DeleteUsersByID(id)
	if err != nil {
		status, body := userDeleteErrorResponse(err)
		return c.Status(status).JSON(body)
	}
	return c.Status(fiber.StatusNoContent).JSON("")
}
