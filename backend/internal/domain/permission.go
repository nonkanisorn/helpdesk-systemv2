package domain

import "time"

type Permission struct {
	ID          int        `db:"id" json:"id"`
	Name        string     `db:"name" json:"name"`
	Description *string    `db:"description" json:"description"`
	CreatedAt   *time.Time `db:"created_at" json:"created_at"`
	UpdatedAt   *time.Time `db:"updated_at" json:"updated_at"`
}

type RolePermission struct {
	RoleID       int        `db:"role_id" json:"role_id"`
	PermissionID int        `db:"permission_id" json:"permission_id"`
	CreatedAt    *time.Time `db:"created_at" json:"created_at"`
}
