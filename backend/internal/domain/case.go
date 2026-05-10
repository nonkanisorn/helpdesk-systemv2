package domain

type CreateTicketRequest struct {
	UserID            int    `json:"user_id"`
	StatusID          int    `json:"status_id"`
	Title             string `json:"title"`
	Description       string `json:"description"`
	IssueCategoriesID int    `json:"issue_categories_id"`
}
type UpdateTicketRequest struct {
	TicketID     int  `json:"ticket_id"`
	StatusID     int  `json:"status_id"`
	ManagerID    *int `json:"manager_id"`
	TechnicianID *int `json:"technician_id"`
}
