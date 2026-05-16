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

//	func ToDB(req *domain.CreateTicketRequest) (*repository.CreateTicketRow, error) {
//		caseToDB := repository.CreateTicketRow{
//			UserID:            req.UserID,
//			StatusID:          req.StatusID,
//			IssueCategoriesID: req.IssueCategoriesID,
//			Title:             req.Title,
//			Description:       req.Description,
//		}
//		return &caseToDB, nil
//	}
func ToDB(req *domain.CreateTicketRequest) (*repository.CreateTicketRow, error) {
	caseToDB := repository.CreateTicketRow{
		UserID:          req.UserID,
		StatusID:        req.StatusID,
		IssueCategoryID: req.IssueCategoriesID,
		Title:           req.Title,
		Description:     req.Description,
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
			ID:               v.ID,
			Title:            v.Title,
			Description:      v.Description,
			ResolutionNote:   v.ResolutionNote,
			IssueCategoryID:  v.IssueCategoryID,
			DeviceInstanceID: v.DeviceInstanceID,
			UserID:           v.UserID,
			TechnicianID:     v.TechnicianID,
			ManagerID:        v.ManagerID,
			StatusID:         v.StatusID,
			CreatedAt:        v.CreatedAt,
			AssignedAt:       v.AssignedAt,
			StartedAt:        v.StartedAt,
			CompletedAt:      v.CompletedAt,
			ClosedAt:         v.ClosedAt,
			UserIDJoin:       v.UserIDJoin,
			UserUsername:     v.UserUsername,
			UserFirstName:    v.UserFirstName,
			UserLastName:     v.UserLastName,
			UserEmail:        v.UserEmail,
			UserPhone:        v.UserPhone,
			UserRoleID:       v.UserRoleID,
			UserDepartmentID: v.UserDepartmentID,
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
		ID:               ticketRow.ID,
		Title:            ticketRow.Title,
		Description:      ticketRow.Description,
		ResolutionNote:   ticketRow.ResolutionNote,
		IssueCategoryID:  ticketRow.IssueCategoryID,
		DeviceInstanceID: ticketRow.DeviceInstanceID,
		UserID:           ticketRow.UserID,
		TechnicianID:     ticketRow.TechnicianID,
		ManagerID:        ticketRow.ManagerID,
		StatusID:         ticketRow.StatusID,
		CreatedAt:        ticketRow.CreatedAt,
		AssignedAt:       ticketRow.AssignedAt,
		StartedAt:        ticketRow.StartedAt,
		CompletedAt:      ticketRow.CompletedAt,
		ClosedAt:         ticketRow.ClosedAt,

		// user join
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
