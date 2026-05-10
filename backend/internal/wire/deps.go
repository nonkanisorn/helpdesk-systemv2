package wire

import (
	"github.com/jmoiron/sqlx"
	loginHand "github.com/nonkanisorn/helpdesk-system/internal/auth/login/handler"
	loginRepo "github.com/nonkanisorn/helpdesk-system/internal/auth/login/repository"
	loginServ "github.com/nonkanisorn/helpdesk-system/internal/auth/login/service"
)

type Handlers struct {
	Login loginHand.LoginHandler
}

func NewHandlers(db *sqlx.DB) Handlers {
	loginRepo := loginRepo.NewLoginRepository(db)
	loginServ := loginServ.NewLoginService(loginRepo)
	loginHandler := loginHand.NewLoginHandler(loginServ)
	return Handlers{
		Login: loginHandler,
	}
}
