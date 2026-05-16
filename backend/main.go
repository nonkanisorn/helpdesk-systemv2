package main

import (
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/config"
	departmentHand "github.com/nonkanisorn/helpdesk-system/internal/department/handler"
	departmentRepo "github.com/nonkanisorn/helpdesk-system/internal/department/repository"
	departmentServ "github.com/nonkanisorn/helpdesk-system/internal/department/service"
	deviceTypeHand "github.com/nonkanisorn/helpdesk-system/internal/device/device_type/handler"
	deviceTypeRepo "github.com/nonkanisorn/helpdesk-system/internal/device/device_type/repository"
	deviceTypeServ "github.com/nonkanisorn/helpdesk-system/internal/device/device_type/service"
	"github.com/nonkanisorn/helpdesk-system/internal/routes"
	"github.com/nonkanisorn/helpdesk-system/internal/wire"

	deviceInstanceHand "github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/handler"
	deviceInstanceRepo "github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/repository"
	deviceInstanceServ "github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/service"

	deviceInstanceQueryHand "github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/handler"
	deviceInstanceQueryServ "github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/service"
	deviceHand "github.com/nonkanisorn/helpdesk-system/internal/device/handler"
	deviceRepo "github.com/nonkanisorn/helpdesk-system/internal/device/repository"
	deviceServ "github.com/nonkanisorn/helpdesk-system/internal/device/service"
	issueHand "github.com/nonkanisorn/helpdesk-system/internal/issue/handler"
	issueRepo "github.com/nonkanisorn/helpdesk-system/internal/issue/repository"
	issueServ "github.com/nonkanisorn/helpdesk-system/internal/issue/service"
	roleHand "github.com/nonkanisorn/helpdesk-system/internal/role/handler"
	roleRepo "github.com/nonkanisorn/helpdesk-system/internal/role/repository"
	roleServ "github.com/nonkanisorn/helpdesk-system/internal/role/service"
	statusHand "github.com/nonkanisorn/helpdesk-system/internal/status/handler"
	statusRepo "github.com/nonkanisorn/helpdesk-system/internal/status/repository"
	statusServ "github.com/nonkanisorn/helpdesk-system/internal/status/service"
	userHand "github.com/nonkanisorn/helpdesk-system/internal/user/handler"
	userRepo "github.com/nonkanisorn/helpdesk-system/internal/user/repository"
	userServ "github.com/nonkanisorn/helpdesk-system/internal/user/service"

	"github.com/nonkanisorn/helpdesk-system/internal/auth/middleware"
	registerHand "github.com/nonkanisorn/helpdesk-system/internal/auth/register/handler"
	registerRepo "github.com/nonkanisorn/helpdesk-system/internal/auth/register/repository"
	registerServ "github.com/nonkanisorn/helpdesk-system/internal/auth/register/service"
	ticketHand "github.com/nonkanisorn/helpdesk-system/internal/case/handler"
	ticketQueryHand "github.com/nonkanisorn/helpdesk-system/internal/case/handler"

	// "github.com/nonkanisorn/helpdesk-system/internal/case/repository"
	ticketQueryRepo "github.com/nonkanisorn/helpdesk-system/internal/case/repository"
	ticketRepo "github.com/nonkanisorn/helpdesk-system/internal/case/repository"
	ticketQueryServ "github.com/nonkanisorn/helpdesk-system/internal/case/service"
	ticketServ "github.com/nonkanisorn/helpdesk-system/internal/case/service"

	userQueryHand "github.com/nonkanisorn/helpdesk-system/internal/user/handler"
	userQueryRepo "github.com/nonkanisorn/helpdesk-system/internal/user/repository"
	userQueryServ "github.com/nonkanisorn/helpdesk-system/internal/user/service"

	loginHand "github.com/nonkanisorn/helpdesk-system/internal/auth/login/handler"
	loginRepo "github.com/nonkanisorn/helpdesk-system/internal/auth/login/repository"
	loginServ "github.com/nonkanisorn/helpdesk-system/internal/auth/login/service"
	gomailServ "github.com/nonkanisorn/helpdesk-system/internal/gomail/service"
)

type Role struct {
	RoleID   int    `db:"role_id"`
	RoleName string `db:"role_name"`
}

func main() {
	config.LoadDotEnv(".env", "backend/.env", "../.env")

	app := fiber.New()
	app.Use(cors.New(cors.Config{AllowOrigins: "http://localhost:5173"}))
	app.Use(func(c *fiber.Ctx) error {
		fmt.Println("HITTTss:", c.Method(), c.Path())
		return c.Next()
	})
	// app.Use(logger.New())
	db, err := sqlx.Open("mysql", "root:@tcp(localhost:3306)/helpdesk_system_v2?parseTime=true&loc=Local")
	if err != nil {
		panic(err)
	}
	h := wire.NewHandlers(db)
	routes.RegisterLogin(app, h)
	// gomail
	gomailService := gomailServ.NewGomailService()
	// Auth

	registerRepo := registerRepo.NewRegisterRepository(db)
	registerServ := registerServ.NewRegisterService(registerRepo, gomailService)
	registerHandler := registerHand.NewRegisterHandler(registerServ)
	// app.Post("/register", registerHandler.CreateUser)
	app.Post("/register", registerHandler.CreateUser)
	app.Post("/forgot-password", registerHandler.RequestPasswordReset)
	app.Post("/set-password", registerHandler.SetPassword)
	// login
	loginRepo := loginRepo.NewLoginRepository(db)
	loginServ := loginServ.NewLoginService(loginRepo)
	loginHandler := loginHand.NewLoginHandler(loginServ)
	app.Post("/login", loginHandler.Login)
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte("secret")},
	}))
	// case
	// ticket
	// note := "testeiei"
	deviceInstanceQueryRepo := deviceInstanceRepo.NewDeviceInstanceQueryRepositoryDB(db)
	ticketQueryRepo := ticketQueryRepo.NewTicketQueryRepository(db)
	ticketQueryServ := ticketQueryServ.NewTicketQueryService(ticketQueryRepo, deviceInstanceQueryRepo)
	ticketQueryHand := ticketQueryHand.NewTicketQueryHandlers(ticketQueryServ)

	go func() {
		for {
			err := ticketQueryServ.AutoCloseTickets()
			if err != nil {
				fmt.Println("err from auto close", err)
			}
			time.Sleep(1 * time.Hour)
		}
	}()
	app.Post("/tickets/status", ticketQueryHand.UpdateStatusTicket)
	app.Patch("/tickets/:id<int>/assign-technician", ticketQueryHand.AssignTechToTicket)
	app.Get("technician/:id<int>/tickets", ticketQueryHand.GetTicketsByTechnicianID)
	app.Get("/tickets/:ticketID<int>/technician", ticketQueryHand.GetTicketForTechnicianByTicketID)
	app.Get("/tickets/:userID<int>/latest/:limit<int>", ticketQueryHand.GetLatestTickets)
	app.Get("/tickets/users/:userID<int>", ticketQueryHand.GetTicketsByUsersID)
	app.Get("/tickets/status/:statusID<int>", ticketQueryHand.GetTicketsByStatusID)
	app.Get("/tickets-detail/:ticketID<int>", ticketQueryHand.GetTicketDetailByID)

	app.Patch("technician/:ticketID<int>/start", ticketQueryHand.StartJobByTechnicianID)
	app.Patch("technician/:ticketID<int>/complete", ticketQueryHand.CompletedJobByTechnician)
	app.Patch("technician/:ticketID<int>/waitingpart", ticketQueryHand.WaitingForPartByTechnicianID)
	app.Patch("/tickets/:ticketID<int>/confirmation", ticketQueryHand.ConfirmAndCloseTicketByUser)

	ticketRepo := ticketRepo.NewTicketRepository(db)
	ticketServ := ticketServ.NewTicketService(ticketRepo)

	ticketHand := ticketHand.NewTicketHandler(ticketServ)

	app.Get("/tickets", ticketHand.GetAllTickets)
	app.Post("/tickets", ticketHand.CreateTicket)
	app.Get("/tickets/:ticketID<int>", ticketHand.GetTicketByID)
	// User
	userRepo := userRepo.NewUserRepository(db)
	userServ := userServ.NewUserService(userRepo)
	userHand := userHand.NewUserHandler(userServ)
	app.Get("/users", userHand.GetAllUsers)
	app.Get("/users/:id<int>", userHand.GetUserByID)
	app.Patch("/users/:id<int>", userHand.UpdateUserByID)
	app.Patch("/users/isactive/:id<int>", userHand.UpdateUserStatusByID)
	app.Delete("/users/:id<int>", userHand.DeleteUsersByID)
	// CheckRoleAdmin
	app.Get("/admin/ping", middleware.CheckRoleAdmin, func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"sucess": true,
		})
	})
	// User Query
	userQueryRepo := userQueryRepo.NewUserQueryRepository(db)
	userQueryServ := userQueryServ.NewUserQueryService(userQueryRepo)
	userQueryHandler := userQueryHand.NewUserQueryHandler(userQueryServ)
	app.Get("/users/by-role/:roleID<int>", userQueryHandler.GetUserByRolesID)
	app.Get("/users/view", userQueryHandler.GetUserWithRolesName)
	app.Get("/current-user/:id<int>", userQueryHandler.GetCurrentUser)
	// admin
	// api.Get("/users", userHand.GetAllUsers)
	// status
	statusReposityDB := statusRepo.NewStatusRepositoryDB(db)
	statusService := statusServ.NewStatusService(statusReposityDB)
	statusHandlers := statusHand.NewStatusHandler(statusService)
	app.Get("/status", statusHandlers.GetStatusAll)
	app.Post("/status", statusHandlers.CreateStatus)
	app.Patch("/status/:id", statusHandlers.UpdateStatusByID)
	app.Delete("/status/:id", statusHandlers.DeleteStatusByID)
	// roles
	roleReposityDB := roleRepo.NewRoleRepositoryDB(db)
	roleService := roleServ.NewRoleService(roleReposityDB)
	roleHandler := roleHand.NewRoleHandler(roleService)
	app.Get("/roles", roleHandler.GetRole)
	app.Post("/roles", roleHandler.CreateRoles)
	app.Get("/roles/:id<int>", roleHandler.GetRoleByID())
	app.Patch("/roles/:id<int>", roleHandler.UpdateRoleByID)
	app.Delete("/roles/:id<int>", roleHandler.DeleteRolesByID)

	// department
	departmentRepo := departmentRepo.NewDepartmentRepositoryDB(db)
	departmentServ := departmentServ.NewDepartmentService(departmentRepo)
	departmentHandler := departmentHand.NewDepartmentHandler(departmentServ)
	// fmt.Println(departmentServ.GetAllDepartments())
	app.Get("/departments", departmentHandler.GetAllDepartments)
	app.Get("/departments/:id<int>", departmentHandler.GetDepartmentByID)
	app.Post("/departments", departmentHandler.CreateDepartments)
	app.Patch("/departments/:id<int>", departmentHandler.UpdateDepartmentByID)
	app.Delete("/departments/:id<int>", departmentHandler.DeleteDepartmentsByID)
	// Device
	deviceRepo := deviceRepo.NewDeviceRepository(db)
	deviceService := deviceServ.NewDeviceService(deviceRepo)
	deviceHandler := deviceHand.NewDeviceHandler(deviceService)
	app.Get("/devices", deviceHandler.GetAllDevice)
	app.Post("/devices", deviceHandler.CreateDevices)
	app.Put("/devices/:id<int>", deviceHandler.UpdateDevices)
	app.Patch("/devices/:id<int>", deviceHandler.UpdateDevices)
	app.Delete("/devices/:id", deviceHandler.DeleteDevices)
	// Device-Type
	deviceTypeRepo := deviceTypeRepo.NewDeviceTypeRepository(db)
	deviceTypeServ := deviceTypeServ.NewDeviceTypeService(deviceTypeRepo)
	deviceTypeHandler := deviceTypeHand.NewDeviceTypeHandler(deviceTypeServ)
	app.Get("/device-types", deviceTypeHandler.GetAllDeviceTypes)
	app.Post("/device-types", deviceTypeHandler.CreateDeviceType)
	app.Patch("/device-types/:id<int>", deviceTypeHandler.UpdateDeviceTypeByID)
	app.Delete("/device-types/:id<int>", deviceTypeHandler.DeleteDeviceTypeByID)
	// Device-Instance
	deviceInstanceRepo := deviceInstanceRepo.NewDeviceInstanceRepository(db)
	deviceInstanceServ := deviceInstanceServ.NewDeviceInstanceService(deviceInstanceRepo)
	deviceInstanceHandler := deviceInstanceHand.NewDeviceInstanceHandler(deviceInstanceServ)
	app.Get("/device-instances", deviceInstanceHandler.GetAllDeviceInstance)
	app.Post("/device-instances", deviceInstanceHandler.Create)
	app.Patch("/device-instances/:instanceID<int>", deviceInstanceHandler.UpdateDeviceInstanceByID)
	app.Put("/device-instances/:instanceID<int>", deviceInstanceHandler.UpdateDeviceInstanceByID)
	app.Delete("/device-instances/:instanceID<int>", deviceInstanceHandler.DeleteDeviceInstanceByID)
	deviceInstanceQueryServ := deviceInstanceQueryServ.NewDeviceInstanceQueryService(deviceInstanceQueryRepo)
	deviceInstanceQueryHand := deviceInstanceQueryHand.NewDeviceInstanceQueryHandler(deviceInstanceQueryServ)
	app.Get("/device-instances/device/:deviceID<int>", deviceInstanceQueryHand.GetDeviceInstanceByDeviceID)
	app.Get("/device-instances/history-repair/:deviceInstanceID<int>", deviceInstanceQueryHand.GetHistoryRepairDeviceInstanceByDeviceInstanceID)
	// Issue
	issueRepo := issueRepo.NewIssueRepository(db)
	issueServ := issueServ.NewIssueService(issueRepo)
	issueHandler := issueHand.NewIssueHandler(issueServ)
	app.Get("/issue-categories", issueHandler.GetAllIssues)
	app.Post("/issue-categories", issueHandler.CreateIssue)
	app.Post("/issues-categories", issueHandler.CreateIssue)
	app.Patch("/issue-categories/:id<int>", issueHandler.UpdateIssueByID)
	app.Patch("/issues-categories/:id<int>", issueHandler.UpdateIssueByID)
	app.Delete("/issue-categories/:id<int>", issueHandler.DeleteIssueByID)
	app.Delete("/issues-categories/:id<int>", issueHandler.DeleteIssueByID)

	app.Get("/technician/summary", func(c *fiber.Ctx) error {
		type technicianSummary struct {
			TechnicianID   int    `db:"technician_id" json:"technician_id"`
			TechnicianName string `db:"technician_name" json:"technician_name"`
			AssignedCount  int    `db:"assigned_count" json:"assigned_count"`
			CompletedCount int    `db:"completed_count" json:"completed_count"`
			OverdueCount   int    `db:"overdue_count" json:"overdue_count"`
		}

		summary := []technicianSummary{}
		query := `
			SELECT
				u.id AS technician_id,
				TRIM(CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, ''))) AS technician_name,
				COUNT(t.id) AS assigned_count,
				SUM(CASE WHEN t.status_id = 5 THEN 1 ELSE 0 END) AS completed_count,
				SUM(CASE WHEN t.completed_at IS NOT NULL AND t.status_id = 4 AND t.completed_at + INTERVAL 3 DAY <= NOW() THEN 1 ELSE 0 END) AS overdue_count
			FROM users u
			LEFT JOIN tickets t
				ON t.technician_id = u.id
			WHERE u.role_id = 3
			GROUP BY u.id, u.first_name, u.last_name
			ORDER BY u.id
		`

		err := db.Select(&summary, query)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
		}

		return c.JSON(fiber.Map{"result": summary})
	})

	if err := app.Listen(":5011"); err != nil {
		panic(err)
	}
}
