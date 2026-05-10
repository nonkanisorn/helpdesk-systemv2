package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/wire"
)

func Register(app *fiber.App, h wire.Handlers) {
	RegisterLogin(app, h)
}
