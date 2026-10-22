package service

import "github.com/nonkanisorn/helpdesk-system/internal/domain"

type TicketService interface {
	CreateTicket(*domain.CreateTicketRequest) error
	GetAllTickets() ([]domain.TicketsResponse, error)
	GetTicketByID(int) (*domain.TicketsResponse, error)
}
type TicketQueryService interface {
	// ---- technician part ----
	StartJobByTechnicianID(int) error
	CompletedJobByTechnician(ticketID int, resolutionNote string, serialNumber *string) error
	WaitingForPartByTechnicianID(ticketID int) error
	UnableToWorkByTechnician(ticketID int, technicianID *int, technicianName string, reason string) error
	// ---- end technicina part ----
	// ---- manager part ----
	AssignTechToTicket(technicianID int, managerID int, ticketID int, managerName string, reason string) error
	// ---- end manager part ----
	// ---- user part ----
	ConfirmAndCloseTicketByUser(int) error
	RejectRepairByUser(ticketID int, userID *int, userName string, reason string) error
	// ---- end user part ----
	// ----dashboard----

	GetTicketDetailByID(ticketID int) (*domain.TicketDetail, error)
	// ----enddashboard ----
	GetTicketsByTechnicianID(int) ([]domain.TicketsResponse, error)
	UpdateStatusTicket(*domain.UpdateTicketRequest) error
	GetTicketForTechnicianByTicketID(int) (*domain.TicketsForTechnicianResponse, error)
	UpdateStatusCompleteByTechnician(string) error
	GetLatestTickets(int, int) ([]domain.TicketsResponse, error)
	GetTicketsByStatusID(int) ([]domain.TicketsResponse, error)
	GetTicketsByUsersID(int) ([]domain.TicketsResponse, error)
	AutoCloseTickets() error
}
