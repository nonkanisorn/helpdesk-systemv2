package repository

import (
	"time"

	"github.com/jmoiron/sqlx"
)

type ticketRepositoryDB struct {
	db *sqlx.DB
}

func NewTicketRepository(db *sqlx.DB) TicketRepository {
	return &ticketRepositoryDB{db: db}
}

func (t ticketRepositoryDB) CreateTicket(ticket *CreateTicketRow) error {
	query := "INSERT INTO tickets( title,description, issue_categories_id,user_id,status_id,created_at ) VALUES(?, ?, ?, ?, ?,?)"
	_, err := t.db.Exec(query, ticket.Title, ticket.Description, ticket.IssueCategoriesID, ticket.UserID, ticket.StatusID, time.Now())
	if err != nil {
		return err
	}
	return nil
}

func (t ticketRepositoryDB) GetAllTickets() ([]TicketRow, error) {
	var ticket []TicketRow
	query := "SELECT * from tickets"
	err := t.db.Select(&ticket, query)
	if err != nil {
		return nil, err
	}
	return ticket, nil
}

func (t ticketRepositoryDB) GetTicketByID(id int) (*TicketRow, error) {
	ticket := TicketRow{}
	query := "SELECT t.ticket_id, t.title, t.description, t.resolution_note, t.issue_categories_id, t.instance_id, t.user_id, t.technician_id, t.manager_id, t.status_id, t.created_at, t.assigned_at, t.started_at, t.completed_at, t.closed_at, u.id AS user_id_join, u.username AS user_username, u.first_name AS user_first_name, u.last_name AS user_last_name, u.email AS user_email, u.phone AS user_phone, u.role_id AS user_role_id, u.department_id AS user_department_id FROM tickets t JOIN users u ON t.user_id = u.id WHERE t.ticket_id = ?;"

	err := t.db.Get(&ticket, query, id)
	if err != nil {
		return nil, err
	}
	return &ticket, nil
}
