package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/case/repository"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type ticketService struct {
	ticketRepo repository.TicketRepository
}

func NewTicketService(ticketRepo repository.TicketRepository) TicketService {
	return &ticketService{ticketRepo: ticketRepo}
}

func ToDB(req *domain.CreateTicketRequest) (*repository.CreateTicketRow, error) {
	caseToDB := repository.CreateTicketRow{
		UserID:            req.UserID,
		StatusID:          req.StatusID,
		IssueCategoriesID: req.IssueCategoriesID,
		Title:             req.Title,
		Description:       req.Description,
	}
	return &caseToDB, nil
}

func (t ticketService) CreateTicket(ticketReq *domain.CreateTicketRequest) error {
	ticket, err := ToDB(ticketReq)
	if err != nil {
		return err
	}
	err = t.ticketRepo.CreateTicket(ticket)
	if err != nil {
		return err
	}
	return nil
}

func rowToResponse(tickets []repository.TicketRow) ([]domain.TicketsResponse, error) {
	ticketResponse := []domain.TicketsResponse{}
	for _, v := range tickets {
		ticket := domain.TicketsResponse{
			TicketID:          v.TicketID,
			Title:             v.Title,
			Description:       v.Description,
			ResolutionNote:    v.ResolutionNote,
			IssueCategoriesID: v.IssueCategoriesID,
			InstanceID:        v.InstanceID,
			UserID:            v.UserID,
			TechnicianID:      v.TechnicianID,
			ManagerID:         v.ManagerID,
			StatusID:          v.StatusID,
			CreatedAt:         v.CreatedAt,
			AssignedDate:      v.AssignedDate,
			StartAt:           v.StartAt,
			CompletedAt:       v.CompletedAt,
			ClosedAt:          v.ClosedAt,
		}
		ticketResponse = append(ticketResponse, ticket)
	}
	return ticketResponse, nil
}

func (t ticketService) GetAllTickets() ([]domain.TicketsResponse, error) {
	tickets, err := t.ticketRepo.GetAllTickets()
	if err != nil {
		return nil, err
	}
	ticketRes, err := rowToResponse(tickets)
	if err != nil {
		return nil, err
	}
	return ticketRes, nil
}

func (t ticketService) GetTicketByID(ticketID int) (*domain.TicketsResponse, error) {
	ticketRow, err := t.ticketRepo.GetTicketByID(ticketID)
	if err != nil {
		return nil, err
	}
	ticketRes := domain.TicketsResponse{
		TicketID:          ticketRow.TicketID,
		Title:             ticketRow.Title,
		Description:       ticketRow.Description,
		ResolutionNote:    ticketRow.ResolutionNote,
		IssueCategoriesID: ticketRow.IssueCategoriesID,
		InstanceID:        ticketRow.InstanceID,
		UserID:            ticketRow.UserID,
		TechnicianID:      ticketRow.TechnicianID,
		ManagerID:         ticketRow.ManagerID,
		StatusID:          ticketRow.StatusID,
		CreatedAt:         ticketRow.CreatedAt,
		AssignedDate:      ticketRow.AssignedDate,
		StartAt:           ticketRow.StartAt,
		CompletedAt:       ticketRow.CompletedAt,
		ClosedAt:          ticketRow.ClosedAt,

		// ✅ เพิ่มตรงนี้
		UserIDJoin:       ticketRow.UserIDJoin,
		UserUsername:     ticketRow.UserUsername,
		UserFirstName:    ticketRow.UserFirstName,
		UserLastName:     ticketRow.UserLastName,
		UserEmail:        ticketRow.UserEmail,
		UserPhone:        ticketRow.UserPhone,
		UserRoleID:       ticketRow.UserRoleID,
		UserDepartmentID: ticketRow.UserDepartmentID,
	}
	return &ticketRes, nil
}
