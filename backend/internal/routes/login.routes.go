package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/nonkanisorn/helpdesk-system/internal/wire"
)

func RegisterLogin(app *fiber.App, h wire.Handlers) {
	app.Post("/logina", h.Login.Login)
}
