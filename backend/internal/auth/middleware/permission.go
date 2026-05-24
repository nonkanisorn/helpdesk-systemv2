package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	permissionService "github.com/nonkanisorn/helpdesk-system/internal/permission/service"
)

func RequirePermission(permissionServ permissionService.PermissionService, permissionName string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		allowed, err := hasAnyPermission(c, permissionServ, []string{permissionName})
		if err != nil {
			return permissionErrorResponse(c, err)
		}
		if !allowed {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"success": false,
				"message": "forbidden",
			})
		}

		c.Locals("permission", permissionName)
		return c.Next()
	}
}

func RequireAnyPermission(permissionServ permissionService.PermissionService, permissionNames ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		allowed, err := hasAnyPermission(c, permissionServ, permissionNames)
		if err != nil {
			return permissionErrorResponse(c, err)
		}
		if !allowed {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"success": false,
				"message": "forbidden",
			})
		}

		return c.Next()
	}
}

func hasAnyPermission(c *fiber.Ctx, permissionServ permissionService.PermissionService, permissionNames []string) (bool, error) {
	token, ok := c.Locals("user").(*jwt.Token)
	if !ok || token == nil {
		return false, fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return false, fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	roleID, roleOK := getIntClaim(claims, "role_id")
	userID, userOK := getIntClaim(claims, "user_id")
	if !userOK && !roleOK {
		return false, fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	for _, permissionName := range permissionNames {
		var allowed bool
		var err error
		if userOK {
			allowed, err = permissionServ.UserHasPermission(userID, permissionName)
		} else {
			allowed, err = permissionServ.RoleHasPermission(roleID, permissionName)
		}
		if err != nil {
			return false, err
		}
		if allowed {
			return true, nil
		}
	}

	return false, nil
}

func permissionErrorResponse(c *fiber.Ctx, err error) error {
	if fiberErr, ok := err.(*fiber.Error); ok && fiberErr.Code == fiber.StatusUnauthorized {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"message": "unauthorized",
		})
	}

	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"success": false,
		"message": "permission check failed",
	})
}

func getIntClaim(claims jwt.MapClaims, key string) (int, bool) {
	value, ok := claims[key]
	if !ok {
		return 0, false
	}

	switch v := value.(type) {
	case float64:
		return int(v), true
	case int:
		return v, true
	case int64:
		return int(v), true
	case string:
		var parsed int
		if _, err := fmt.Sscanf(v, "%d", &parsed); err != nil {
			return 0, false
		}
		return parsed, true
	default:
		return 0, false
	}
}
