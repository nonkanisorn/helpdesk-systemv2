package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func CheckRoleAdmin(c *fiber.Ctx) error {
	fmt.Println("middleware")
	user, ok := c.Locals("user").(*jwt.Token)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "StatusUnauthorized",
		})
	}
	claims := user.Claims.(jwt.MapClaims)
	// fmt.Println("claims", claims["role_id"])
	v, ok := claims["role_id"]
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "StatusUnauthorized",
		})
	}
	roleID := int(v.(float64))
	if roleID != 1 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"success": false,
			"message": "StatusForbidden",
		})
	}
	return c.Next()
}
