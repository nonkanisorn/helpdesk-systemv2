package repository

import (
	"fmt"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
	// "github.com/pelletier/go-toml/query"
)

type ticketQueryRepository struct {
	db *sqlx.DB
}

func NewTicketQueryRepository(db *sqlx.DB) TicketQueryRepository {
	return ticketQueryRepository{db: db}
}

func (t ticketQueryRepository) GetTicketsByTechnicianID(techID int) ([]TicketRow, error) {
	var tickets []TicketRow
	query := "select * from tickets t where t.technician_id = ?"
	err := t.db.Select(&tickets, query, techID)
	if err != nil {
		return nil, err
	}
	return tickets, nil
}

func (t ticketQueryRepository) GetTicketsByUsersID(usersID int) ([]TicketRow, error) {
	var tickets []TicketRow
	query := "select * from tickets where user_id = ? "
	err := t.db.Select(&tickets, query, usersID)
	if err != nil {
		return nil, err
	}
	return tickets, nil
}

func (t ticketQueryRepository) UpdateStatusTicket(updateTicketRow *UpdateTicketRow) error {
	setClauses := []string{"status_id = ? "}
	args := []any{updateTicketRow.StatusID}
	if updateTicketRow.ManagerID != nil {
		setClauses = append(setClauses, "manager_id = ? ")
		args = append(args, *updateTicketRow.ManagerID)
	}
	if updateTicketRow.TechnicianID != nil {
		setClauses = append(setClauses, "technician_id = ? ")
		args = append(args, *updateTicketRow.TechnicianID)
	}
	query := fmt.Sprintf("UPDATE tickets SET %v where ticket_id = ? ", strings.Join(setClauses, ", "))
	args = append(args, updateTicketRow.TicketID)
	_, err := t.db.Exec(query, args...)
	if err != nil {
		return err
	}
	return nil
}

func (t ticketQueryRepository) AssignTechToTickets(techID int, managerID int, tikcetID int) error {
	statusID := 2
	query := "update tickets t set technician_id = ?, manager_id = ?, status_id = ? , assigned_at = NOW() where ticket_id = ?"
	_, err := t.db.Exec(query, techID, managerID, statusID, tikcetID)
	if err != nil {
		return err
	}
	return nil
}

func (t ticketQueryRepository) GetTicketForTechnicianByTicketID(ticketID int) (*TicketsForTechnicianRow, error) {
	var ticket TicketsForTechnicianRow
	query := "select t.ticket_id,u.first_name ,u.last_name  ,u.phone, t.description ,t.title ,t.created_at,t.assigned_at,t.completed_at ,t.closed_at  ,d.dep_name, ic.issue_name  from tickets t  join users u on t.user_id = u.id join departments d on u.department_id = d.dep_id join issue_categories ic    on t.issue_categories_id  = ic.id     where t.ticket_id  = ?"
	err := t.db.Get(&ticket, query, ticketID)
	if err != nil {
		return nil, err
	}
	return &ticket, nil
}

func (t ticketQueryRepository) UpdateStatusTicketByTechnician(ticket *TicketRow) error {
	if ticket.ResolutionNote != nil {
		query := "UPDATE  tickets SET resolution_note = ? ,instance_id = ?,status_id = ? ,completed_at = ?  WHERE ticket_id = ? "
		completedAt := time.Now()
		statusID := 4
		_, err := t.db.Exec(query, ticket.ResolutionNote, ticket.InstanceID, statusID, completedAt, ticket.TicketID)
		if err != nil {
			return err
		}
		return nil
	}
	query := "UPDATE  tickets SET status_id = ? ,started_at = ?  WHERE ticket_id = ? "
	statusID := 3
	startedAt := time.Now()
	_, err := t.db.Exec(query, statusID, startedAt, ticket.TicketID)
	if err != nil {
		return err
	}
	return nil
}

func (t ticketQueryRepository) UpdateStatusCompleteByTechnician(ticket *TicketRow) error {
	query := "UPDATE  tickets SET resolution_note = ? ,instance_id = ?,status_id = ? ,completed_at = ?  WHERE ticket_id = ? "
	_, err := t.db.Exec(query, ticket.ResolutionNote, ticket.InstanceID, ticket.StatusID, ticket.CompletedAt, ticket.TicketID)
	if err != nil {
		return err
	}
	return nil
}

func (t ticketQueryRepository) GetLatestTickets(userID int, limit int) ([]TicketRow, error) {
	var tickets []TicketRow
	query := "SELECT * FROM tickets WHERE user_id = ?  ORDER BY created_at DESC LIMIT ? "
	err := t.db.Select(&tickets, query, userID, limit)
	if err != nil {
		return nil, err
	}
	return tickets, nil
}

func (t ticketQueryRepository) GetTicketsByStatusID(statusID int) ([]TicketRow, error) {
	var tickets []TicketRow
	query := "SELECT * FROM tickets WHERE status_id = ? "
	err := t.db.Select(&tickets, query, statusID)
	if err != nil {
		return nil, err
	}
	return tickets, nil
}

func (t ticketQueryRepository) StartJobByTechnicianID(ticketID int) error {
	statusID := 3
	startedAt := time.Now()
	query := "UPDATE  tickets SET status_id = ? ,started_at = ?  WHERE ticket_id = ? "
	_, err := t.db.Exec(query, statusID, startedAt, ticketID)
	if err != nil {
		return err
	}

	return nil
}

func (t ticketQueryRepository) CompletedJobByTechnician(ticketID int, instanceDeviceID *int, resolutionNote string) error {
	statusID := 4
	completedAt := time.Now()
	query := "UPDATE  tickets SET resolution_note = ?, instance_id = ?  ,status_id = ? ,completed_at = ?  WHERE ticket_id = ? "
	_, err := t.db.Exec(query, resolutionNote, instanceDeviceID, statusID, completedAt, ticketID)
	if err != nil {
		return err
	}
	return nil
}

func (t ticketQueryRepository) ConfirmAndCloseTicketByUser(ticketID int) error {
	statusID := 5
	closedAt := time.Now()
	query := "UPDATE  tickets SET status_id = ? , closed_at = ?  WHERE ticket_id = ? "
	_, err := t.db.Exec(query, statusID, closedAt, ticketID)
	if err != nil {
		return err
	}
	return nil
}

func (t ticketQueryRepository) GetTicketForAutoClose() ([]int, error) {
	var ticketID []int
	query := "select ticket_id from tickets where completed_at is NOT NULL AND status_id = 4 AND completed_at + INTERVAL + 3 DAY <= NOW()"
	err := t.db.Select(&ticketID, query)
	if err != nil {
		return nil, err
	}
	return ticketID, nil
}

func (t ticketQueryRepository) AutoCloseTickets(ticketID int) error {
	status := 5
	query := "update tickets set status_id = ? , closed_at = NOW() where  ticket_id = ?"
	_, err := t.db.Exec(query, status, ticketID)
	if err != nil {
		return err
	}
	return nil
}

func (t ticketQueryRepository) WaitingForPartByTechnicianID(ticketID int) error {
	statusID := 5
	query := "UPDATE  tickets SET status_id = ?  WHERE ticket_id = ? "
	_, err := t.db.Exec(query, statusID, ticketID)
	if err != nil {
		return err
	}
	return nil
}

func (t ticketQueryRepository) GetTicketDetailByID(ticketID int) (*domain.TicketDetail, error) {
	var ticketDetail domain.TicketDetail
	query := `SELECT
    t.ticket_id,
    t.title,
    t.description,
    t.resolution_note,
    t.issue_categories_id,
    t.instance_id,
    t.user_id,
    t.technician_id,
    t.manager_id,
    t.status_id,
    t.created_at,
    t.assigned_at,
    t.started_at,
    t.completed_at,
    t.closed_at,

    ic.issue_name AS issues_categories_name,

    s.status_name,

    u.id AS user_id_join,
    u.first_name AS user_first_name,
    u.last_name AS user_last_name,
    u.email AS user_email,
    u.phone AS user_phone,
    u.department_id AS user_department_id,
    ud.dep_name AS user_department_name,

    m.id AS manager_id_join,
    m.first_name AS manager_first_name,
    m.last_name AS manager_last_name,
    m.email AS manager_email,
    m.phone AS manager_phone,
    m.department_id AS manager_department_id,
    md.dep_name AS manager_department_name,

    tech.id AS technician_id_join,
    tech.first_name AS technician_first_name,
    tech.last_name AS technician_last_name,
    tech.email AS technician_email,
    tech.phone AS technician_phone,
    tech.department_id AS technician_department_id,
    td.dep_name AS technician_department_name,

    di.instance_id AS device_instance_id,
    di.serial_number,
    di.device_number,
    di.dep_id AS device_department_id,
    dd.dep_name AS device_department_name,

    d.dev_id AS device_id,
    d.dev_name AS device_name,
    d.dev_description AS device_description,

    dt.devicetype_id AS device_type_id,
    dt.devicetype_name AS device_type_name

FROM tickets t

LEFT JOIN issue_categories ic
    ON t.issue_categories_id = ic.id

LEFT JOIN status s
    ON t.status_id = s.status_id

LEFT JOIN users u
    ON t.user_id = u.id

LEFT JOIN departments ud
    ON u.department_id = ud.dep_id

LEFT JOIN users m
    ON t.manager_id = m.id

LEFT JOIN departments md
    ON m.department_id = md.dep_id

LEFT JOIN users tech
    ON t.technician_id = tech.id

LEFT JOIN departments td
    ON tech.department_id = td.dep_id

LEFT JOIN device_instances di
    ON t.instance_id = di.instance_id

LEFT JOIN departments dd
    ON di.dep_id = dd.dep_id

LEFT JOIN devices d
    ON di.device_id = d.dev_id

LEFT JOIN device_types dt
    ON d.dev_type = dt.devicetype_id

WHERE t.ticket_id = ? 
	`
	err := t.db.Get(&ticketDetail, query, ticketID)
	if err != nil {
		return nil, err
	}
	return &ticketDetail, nil
}
