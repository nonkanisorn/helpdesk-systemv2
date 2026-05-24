package wire

import (
	"github.com/jmoiron/sqlx"
	loginHand "github.com/nonkanisorn/helpdesk-system/internal/auth/login/handler"
	loginRepo "github.com/nonkanisorn/helpdesk-system/internal/auth/login/repository"
	loginServ "github.com/nonkanisorn/helpdesk-system/internal/auth/login/service"
	permissionRepo "github.com/nonkanisorn/helpdesk-system/internal/permission/repository"
	permissionServ "github.com/nonkanisorn/helpdesk-system/internal/permission/service"
)

type Handlers struct {
	Login loginHand.LoginHandler
}

func NewHandlers(db *sqlx.DB) Handlers {
	permissionRepo := permissionRepo.NewPermissionRepository(db)
	permissionServ := permissionServ.NewPermissionService(permissionRepo)
	loginRepo := loginRepo.NewLoginRepository(db)
	loginServ := loginServ.NewLoginService(loginRepo, permissionServ)
	loginHandler := loginHand.NewLoginHandler(loginServ)
	return Handlers{
		Login: loginHandler,
	}
}
