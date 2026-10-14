START TRANSACTION;

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'create_ticket', 'Create repair tickets', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'create_ticket');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'view_own_ticket', 'View own repair tickets', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'view_own_ticket');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'view_all_ticket', 'View all repair tickets', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'view_all_ticket');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'view_assigned_ticket', 'View assigned repair tickets', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'view_assigned_ticket');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'assign_ticket', 'Assign tickets to technicians', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'assign_ticket');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'update_ticket_status', 'Update repair ticket status', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'update_ticket_status');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'add_resolution_note', 'Add repair resolution notes', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'add_resolution_note');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'confirm_repair', 'Confirm or request review of completed repairs', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'confirm_repair');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'manage_users', 'Manage users', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'manage_users');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'manage_roles', 'Manage roles', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'manage_roles');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'manage_departments', 'Manage departments', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'manage_departments');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'view_devices', 'View devices and device instances', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'view_devices');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'manage_devices', 'Manage devices and device instances', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'manage_devices');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'manage_issue_categories', 'Manage issue categories', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'manage_issue_categories');

INSERT INTO permissions (name, description, created_at, updated_at)
SELECT 'manage_ticket_statuses', 'Manage ticket statuses', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'manage_ticket_statuses');

INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
SELECT r.id, p.id, NOW()
FROM roles r
CROSS JOIN permissions p
WHERE LOWER(r.name) = 'admin';

INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
SELECT r.id, p.id, NOW()
FROM roles r
JOIN permissions p
	ON p.name IN ('view_all_ticket', 'assign_ticket', 'view_devices')
WHERE LOWER(r.name) = 'manager';

INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
SELECT r.id, p.id, NOW()
FROM roles r
JOIN permissions p
	ON p.name IN ('view_assigned_ticket', 'update_ticket_status', 'add_resolution_note', 'view_devices')
WHERE LOWER(r.name) = 'technician';

DELETE rp
FROM role_permissions rp
JOIN roles r
	ON r.id = rp.role_id
JOIN permissions p
	ON p.id = rp.permission_id
WHERE LOWER(r.name) = 'technician'
	AND p.name = 'manage_devices';

INSERT IGNORE INTO role_permissions (role_id, permission_id, created_at)
SELECT r.id, p.id, NOW()
FROM roles r
JOIN permissions p
	ON p.name IN ('create_ticket', 'view_own_ticket', 'confirm_repair')
WHERE LOWER(r.name) = 'user';

COMMIT;
