package repository

import (
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type restoreRepositoryDB struct {
	db *sqlx.DB
}

type restoreResourceConfig struct {
	ResourceType  string
	ResourceLabel string
	TableName     string
	NameExpr      string
	Description   string
}

var restoreResources = map[string]restoreResourceConfig{
	"departments": {
		ResourceType:  "departments",
		ResourceLabel: "แผนก",
		TableName:     "departments",
		NameExpr:      "name",
	},
	"device-instances": {
		ResourceType:  "device-instances",
		ResourceLabel: "เครื่องอุปกรณ์",
		TableName:     "device_instances",
		NameExpr:      "serial_number",
		Description:   "CONCAT('Device ID: ', COALESCE(CAST(device_id AS CHAR), '-'), ', เลขเครื่อง: ', COALESCE(CAST(device_number AS CHAR), '-'))",
	},
	"device-types": {
		ResourceType:  "device-types",
		ResourceLabel: "ประเภทอุปกรณ์",
		TableName:     "device_types",
		NameExpr:      "name",
	},
	"devices": {
		ResourceType:  "devices",
		ResourceLabel: "อุปกรณ์",
		TableName:     "devices",
		NameExpr:      "name",
		Description:   "description",
	},
	"issue-categories": {
		ResourceType:  "issue-categories",
		ResourceLabel: "ประเภทปัญหา",
		TableName:     "issue_categories",
		NameExpr:      "name",
	},
	"roles": {
		ResourceType:  "roles",
		ResourceLabel: "บทบาท",
		TableName:     "roles",
		NameExpr:      "name",
	},
	"ticket-statuses": {
		ResourceType:  "ticket-statuses",
		ResourceLabel: "สถานะ",
		TableName:     "ticket_statuses",
		NameExpr:      "name",
	},
}

func NewRestoreRepository(db *sqlx.DB) RestoreRepository {
	return restoreRepositoryDB{db: db}
}

func (r restoreRepositoryDB) GetDeletedItems() ([]DeletedItem, error) {
	items := []DeletedItem{}

	resourceOrder := []string{
		"departments",
		"device-instances",
		"device-types",
		"devices",
		"issue-categories",
		"roles",
		"ticket-statuses",
	}

	for _, resourceType := range resourceOrder {
		config := restoreResources[resourceType]
		descriptionExpr := "NULL"
		if config.Description != "" {
			descriptionExpr = config.Description
		}

		whereClause := "deleted_at IS NOT NULL"
		deletedAtExpr := "deleted_at"
		orderExpr := "deleted_at DESC, id DESC"
		if resourceType == "device-instances" {
			whereClause = "status = 'inactive'"
			deletedAtExpr = "NULL AS deleted_at"
			orderExpr = "id DESC"
		}

		query := fmt.Sprintf(`
			SELECT
				? AS resource_type,
				? AS resource_label,
				id,
				%s AS name,
				%s AS description,
				%s
			FROM %s
			WHERE %s
			ORDER BY %s
		`, config.NameExpr, descriptionExpr, deletedAtExpr, config.TableName, whereClause, orderExpr)

		resourceItems := []DeletedItem{}
		if err := r.db.Select(&resourceItems, query, config.ResourceType, config.ResourceLabel); err != nil {
			return nil, err
		}

		items = append(items, resourceItems...)
	}

	return items, nil
}

func (r restoreRepositoryDB) Restore(resourceType string, id int) error {
	config, ok := restoreResources[resourceType]
	if !ok {
		return sql.ErrNoRows
	}

	if resourceType == "device-instances" {
		result, err := r.db.Exec(
			"UPDATE device_instances SET status = 'active' WHERE id = ? AND status = 'inactive'",
			id,
		)
		if err != nil {
			return err
		}

		affected, err := result.RowsAffected()
		if err != nil {
			return err
		}
		if affected == 0 {
			return sql.ErrNoRows
		}

		return nil
	}

	query := fmt.Sprintf(`
		UPDATE %s
		SET deleted_at = NULL
		WHERE id = ?
			AND deleted_at IS NOT NULL
	`, config.TableName)

	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	affected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
