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
	permissionHand "github.com/nonkanisorn/helpdesk-system/internal/permission/handler"
	permissionRepo "github.com/nonkanisorn/helpdesk-system/internal/permission/repository"
	permissionServ "github.com/nonkanisorn/helpdesk-system/internal/permission/service"
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
	permissionRepo := permissionRepo.NewPermissionRepository(db)
	permissionServ := permissionServ.NewPermissionService(permissionRepo)
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
	loginServ := loginServ.NewLoginService(loginRepo, permissionServ)
	loginHandler := loginHand.NewLoginHandler(loginServ)
	app.Post("/login", loginHandler.Login)
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte("secret")},
	}))
	require := func(permissionName string) fiber.Handler {
		return middleware.RequirePermission(permissionServ, permissionName)
	}
	requireAny := func(permissionNames ...string) fiber.Handler {
		return middleware.RequireAnyPermission(permissionServ, permissionNames...)
	}
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
	app.Post("/tickets/status", require("update_ticket_status"), ticketQueryHand.UpdateStatusTicket)
	app.Patch("/tickets/:id<int>/assign-technician", require("assign_ticket"), ticketQueryHand.AssignTechToTicket)
	app.Get("technician/:id<int>/tickets", require("view_assigned_ticket"), ticketQueryHand.GetTicketsByTechnicianID)
	app.Get("/tickets/:ticketID<int>/technician", require("view_assigned_ticket"), ticketQueryHand.GetTicketForTechnicianByTicketID)
	app.Get("/tickets/:userID<int>/latest/:limit<int>", require("view_own_ticket"), ticketQueryHand.GetLatestTickets)
	app.Get("/tickets/users/:userID<int>", require("view_own_ticket"), ticketQueryHand.GetTicketsByUsersID)
	app.Get("/tickets/status/:statusID<int>", require("view_all_ticket"), ticketQueryHand.GetTicketsByStatusID)
	app.Get("/tickets-detail/:ticketID<int>", requireAny("view_own_ticket", "view_all_ticket", "view_assigned_ticket"), ticketQueryHand.GetTicketDetailByID)

	app.Patch("technician/:ticketID<int>/start", require("update_ticket_status"), ticketQueryHand.StartJobByTechnicianID)
	app.Patch("technician/:ticketID<int>/complete", require("add_resolution_note"), ticketQueryHand.CompletedJobByTechnician)
	app.Patch("technician/:ticketID<int>/waitingpart", require("update_ticket_status"), ticketQueryHand.WaitingForPartByTechnicianID)
	app.Patch("/tickets/:ticketID<int>/confirmation", require("confirm_repair"), ticketQueryHand.ConfirmAndCloseTicketByUser)
	app.Patch("/tickets/:ticketID<int>/reject-repair", require("confirm_repair"), ticketQueryHand.RejectRepairByUser)

	ticketRepo := ticketRepo.NewTicketRepository(db)
	ticketServ := ticketServ.NewTicketService(ticketRepo)

	ticketHand := ticketHand.NewTicketHandler(ticketServ)

	app.Get("/tickets", require("view_all_ticket"), ticketHand.GetAllTickets)
	app.Post("/tickets", require("create_ticket"), ticketHand.CreateTicket)
	app.Get("/tickets/:ticketID<int>", requireAny("view_own_ticket", "view_all_ticket", "view_assigned_ticket"), ticketHand.GetTicketByID)
	// User
	userRepo := userRepo.NewUserRepository(db)
	userServ := userServ.NewUserService(userRepo)
	userHand := userHand.NewUserHandler(userServ)
	app.Get("/users", require("manage_users"), userHand.GetAllUsers)
	app.Get("/users/:id<int>", require("manage_users"), userHand.GetUserByID)
	app.Patch("/users/:id<int>", require("manage_users"), userHand.UpdateUserByID)
	app.Patch("/users/isactive/:id<int>", require("manage_users"), userHand.UpdateUserStatusByID)
	app.Delete("/users/:id<int>", require("manage_users"), userHand.DeleteUsersByID)
	// CheckRoleAdmin
	app.Get("/admin/ping", require("manage_users"), func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"sucess": true,
		})
	})
	// User Query
	userQueryRepo := userQueryRepo.NewUserQueryRepository(db)
	userQueryServ := userQueryServ.NewUserQueryService(userQueryRepo, permissionServ)
	userQueryHandler := userQueryHand.NewUserQueryHandler(userQueryServ)
	app.Get("/users/by-role/:roleID<int>", require("manage_users"), userQueryHandler.GetUserByRolesID)
	app.Get("/users/view", require("manage_users"), userQueryHandler.GetUserWithRolesName)
	app.Get("/current-user/:id<int>", userQueryHandler.GetCurrentUser)
	// admin
	// api.Get("/users", userHand.GetAllUsers)
	// status
	statusReposityDB := statusRepo.NewStatusRepositoryDB(db)
	statusService := statusServ.NewStatusService(statusReposityDB)
	statusHandlers := statusHand.NewStatusHandler(statusService)
	app.Get("/status", statusHandlers.GetStatusAll)
	app.Post("/status", require("manage_ticket_statuses"), statusHandlers.CreateStatus)
	app.Patch("/status/:id", require("manage_ticket_statuses"), statusHandlers.UpdateStatusByID)
	app.Delete("/status/:id", require("manage_ticket_statuses"), statusHandlers.DeleteStatusByID)
	// roles
	roleReposityDB := roleRepo.NewRoleRepositoryDB(db)
	roleService := roleServ.NewRoleService(roleReposityDB)
	roleHandler := roleHand.NewRoleHandlerWithPermission(roleService, permissionServ)
	app.Get("/roles", roleHandler.GetRole)
	app.Post("/roles", require("manage_roles"), roleHandler.CreateRoles)
	app.Get("/roles/:id<int>", roleHandler.GetRoleByID())
	app.Patch("/roles/:id<int>", require("manage_roles"), roleHandler.UpdateRoleByID)
	app.Delete("/roles/:id<int>", require("manage_roles"), roleHandler.DeleteRolesByID)

	permissionHandler := permissionHand.NewPermissionHandler(permissionServ)
	app.Get("/permissions", require("manage_roles"), permissionHandler.GetAllPermissions)
	app.Get("/roles/:id<int>/permissions", require("manage_roles"), permissionHandler.GetRolePermissions)
	app.Put("/roles/:id<int>/permissions", require("manage_roles"), permissionHandler.UpdateRolePermissions)
	app.Patch("/roles/:id<int>/permissions", require("manage_roles"), permissionHandler.UpdateRolePermissions)

	// department
	departmentRepo := departmentRepo.NewDepartmentRepositoryDB(db)
	departmentServ := departmentServ.NewDepartmentService(departmentRepo)
	departmentHandler := departmentHand.NewDepartmentHandler(departmentServ)
	// fmt.Println(departmentServ.GetAllDepartments())
	app.Get("/departments", departmentHandler.GetAllDepartments)
	app.Get("/departments/:id<int>", departmentHandler.GetDepartmentByID)
	app.Post("/departments", require("manage_departments"), departmentHandler.CreateDepartments)
	app.Patch("/departments/:id<int>", require("manage_departments"), departmentHandler.UpdateDepartmentByID)
	app.Delete("/departments/:id<int>", require("manage_departments"), departmentHandler.DeleteDepartmentsByID)
	// Device
	deviceRepo := deviceRepo.NewDeviceRepository(db)
	deviceService := deviceServ.NewDeviceService(deviceRepo)
	deviceHandler := deviceHand.NewDeviceHandler(deviceService)
	app.Get("/devices", requireAny("view_devices", "manage_devices"), deviceHandler.GetAllDevice)
	app.Post("/devices", require("manage_devices"), deviceHandler.CreateDevices)
	app.Put("/devices/:id<int>", require("manage_devices"), deviceHandler.UpdateDevices)
	app.Patch("/devices/:id<int>", require("manage_devices"), deviceHandler.UpdateDevices)
	app.Delete("/devices/:id", require("manage_devices"), deviceHandler.DeleteDevices)
	// Device-Type
	deviceTypeRepo := deviceTypeRepo.NewDeviceTypeRepository(db)
	deviceTypeServ := deviceTypeServ.NewDeviceTypeService(deviceTypeRepo)
	deviceTypeHandler := deviceTypeHand.NewDeviceTypeHandler(deviceTypeServ)
	app.Get("/device-types", requireAny("view_devices", "manage_devices"), deviceTypeHandler.GetAllDeviceTypes)
	app.Post("/device-types", require("manage_devices"), deviceTypeHandler.CreateDeviceType)
	app.Patch("/device-types/:id<int>", require("manage_devices"), deviceTypeHandler.UpdateDeviceTypeByID)
	app.Delete("/device-types/:id<int>", require("manage_devices"), deviceTypeHandler.DeleteDeviceTypeByID)
	// Device-Instance
	deviceInstanceRepo := deviceInstanceRepo.NewDeviceInstanceRepository(db)
	deviceInstanceServ := deviceInstanceServ.NewDeviceInstanceService(deviceInstanceRepo)
	deviceInstanceHandler := deviceInstanceHand.NewDeviceInstanceHandler(deviceInstanceServ)
	app.Get("/device-instances", requireAny("view_devices", "manage_devices"), deviceInstanceHandler.GetAllDeviceInstance)
	app.Post("/device-instances", require("manage_devices"), deviceInstanceHandler.Create)
	app.Patch("/device-instances/:instanceID<int>", require("manage_devices"), deviceInstanceHandler.UpdateDeviceInstanceByID)
	app.Put("/device-instances/:instanceID<int>", require("manage_devices"), deviceInstanceHandler.UpdateDeviceInstanceByID)
	app.Delete("/device-instances/:instanceID<int>", require("manage_devices"), deviceInstanceHandler.DeleteDeviceInstanceByID)
	deviceInstanceQueryServ := deviceInstanceQueryServ.NewDeviceInstanceQueryService(deviceInstanceQueryRepo)
	deviceInstanceQueryHand := deviceInstanceQueryHand.NewDeviceInstanceQueryHandler(deviceInstanceQueryServ)
	app.Get("/device-instances/device/:deviceID<int>", requireAny("view_devices", "manage_devices"), deviceInstanceQueryHand.GetDeviceInstanceByDeviceID)
	app.Get("/device-instances/history-repair/:deviceInstanceID<int>", requireAny("view_devices", "manage_devices"), deviceInstanceQueryHand.GetHistoryRepairDeviceInstanceByDeviceInstanceID)
	// Issue
	issueRepo := issueRepo.NewIssueRepository(db)
	issueServ := issueServ.NewIssueService(issueRepo)
	issueHandler := issueHand.NewIssueHandler(issueServ)
	app.Get("/issue-categories", issueHandler.GetAllIssues)
	app.Post("/issue-categories", require("manage_issue_categories"), issueHandler.CreateIssue)
	app.Post("/issues-categories", require("manage_issue_categories"), issueHandler.CreateIssue)
	app.Patch("/issue-categories/:id<int>", require("manage_issue_categories"), issueHandler.UpdateIssueByID)
	app.Patch("/issues-categories/:id<int>", require("manage_issue_categories"), issueHandler.UpdateIssueByID)
	app.Delete("/issue-categories/:id<int>", require("manage_issue_categories"), issueHandler.DeleteIssueByID)
	app.Delete("/issues-categories/:id<int>", require("manage_issue_categories"), issueHandler.DeleteIssueByID)

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
