# Helpdesk API List

Base URL: `http://localhost:5011`

Auth header for protected endpoints:

```http
Authorization: Bearer YOUR_TOKEN
```

Middleware notation:

- `Public`: route is registered before JWT middleware.
- `JWT`: route is registered after JWT middleware but has no permission middleware.
- `RequirePermission(x)`: route requires JWT and permission `x`.
- `RequireAnyPermission(a,b,c)`: route requires JWT and at least one listed permission.

## Auth / Public

| Method | Route | Middleware | Body |
|---|---|---|---|
| POST | `/logina` | Public | `email`, `password` |
| POST | `/login` | Public | `email`, `password` |
| POST | `/register` | Public | `email`, `first_name`, `last_name`, `phone`, `role_id`, `department_id`, `status` |
| POST | `/forgot-password` | Public | `email` |
| POST | `/set-password` | Public | `token`, `password` |

## User

| Method | Route | Middleware | Body |
|---|---|---|---|
| POST | `/tickets` | `RequirePermission(create_ticket)` | `user_id`, `status_id`, `title`, `description`, `issue_categories_id` |
| GET | `/tickets/users/:userID` | `RequirePermission(view_own_ticket)` | - |
| GET | `/tickets/:userID/latest/:limit` | `RequirePermission(view_own_ticket)` | - |
| GET | `/tickets/:ticketID` | `RequireAnyPermission(view_own_ticket, view_all_ticket, view_assigned_ticket)` | - |
| GET | `/tickets-detail/:ticketID` | `RequireAnyPermission(view_own_ticket, view_all_ticket, view_assigned_ticket)` | - |
| PATCH | `/tickets/:ticketID/confirmation` | `RequirePermission(confirm_repair)` | - |
| PATCH | `/tickets/:ticketID/reject-repair` | `RequirePermission(confirm_repair)` | - |
| GET | `/current-user/:id` | JWT | - |
| GET | `/departments` | JWT | - |
| GET | `/issue-categories` | JWT | - |
| GET | `/status` | JWT | - |

## Technician

| Method | Route | Middleware | Body |
|---|---|---|---|
| GET | `/technician/:id/tickets` | `RequirePermission(view_assigned_ticket)` | - |
| GET | `/tickets/:ticketID/technician` | `RequirePermission(view_assigned_ticket)` | - |
| PATCH | `/technician/:ticketID/start` | `RequirePermission(update_ticket_status)` | - |
| PATCH | `/technician/:ticketID/complete` | `RequirePermission(add_resolution_note)` | `resolution_note`, `serial_number` |
| PATCH | `/technician/:ticketID/waitingpart` | `RequirePermission(update_ticket_status)` | body ignored |
| GET | `/devices` | `RequireAnyPermission(view_devices, manage_devices)` | - |
| GET | `/device-types` | `RequireAnyPermission(view_devices, manage_devices)` | - |
| GET | `/device-instances` | `RequireAnyPermission(view_devices, manage_devices)` | - |
| GET | `/device-instances/device/:deviceID` | `RequireAnyPermission(view_devices, manage_devices)` | - |
| GET | `/device-instances/history-repair/:deviceInstanceID` | `RequireAnyPermission(view_devices, manage_devices)` | - |

## Manager

| Method | Route | Middleware | Body |
|---|---|---|---|
| GET | `/tickets` | `RequirePermission(view_all_ticket)` | - |
| GET | `/tickets/status/:statusID` | `RequirePermission(view_all_ticket)` | - |
| GET | `/tickets-detail/:ticketID` | `RequireAnyPermission(view_own_ticket, view_all_ticket, view_assigned_ticket)` | - |
| PATCH | `/tickets/:id/assign-technician` | `RequirePermission(assign_ticket)` | `ticket_id`, `technician_id`, `manager_id` |
| GET | `/technician/summary` | JWT | - |
| GET | `/devices` | `RequireAnyPermission(view_devices, manage_devices)` | - |
| GET | `/device-types` | `RequireAnyPermission(view_devices, manage_devices)` | - |
| GET | `/device-instances` | `RequireAnyPermission(view_devices, manage_devices)` | - |
| GET | `/device-instances/device/:deviceID` | `RequireAnyPermission(view_devices, manage_devices)` | - |
| GET | `/device-instances/history-repair/:deviceInstanceID` | `RequireAnyPermission(view_devices, manage_devices)` | - |

## Admin

| Method | Route | Middleware | Body |
|---|---|---|---|
| GET | `/admin/ping` | `RequirePermission(manage_users)` | - |
| GET | `/users` | `RequirePermission(manage_users)` | - |
| GET | `/users/:id` | `RequirePermission(manage_users)` | - |
| PATCH | `/users/:id` | `RequirePermission(manage_users)` | `password`, `first_name`, `last_name`, `email`, `phone`, `role_id`, `department_id`, `dep_id`, `status`, `is_active` |
| PATCH | `/users/isactive/:id` | `RequirePermission(manage_users)` | `status` (`active`, `inactive`, `suspended`) or `is_active` |
| DELETE | `/users/:id` | `RequirePermission(manage_users)` | - |
| GET | `/users/by-role/:roleID` | `RequirePermission(manage_users)` | - |
| GET | `/users/view` | `RequirePermission(manage_users)` | - |
| GET | `/roles` | JWT | - |
| GET | `/roles/:id` | JWT | - |
| POST | `/roles` | `RequirePermission(manage_roles)` | `role_name`, `permission_ids`, `permissions` |
| PATCH | `/roles/:id` | `RequirePermission(manage_roles)` | `role_name`, `permission_ids`, `permissions` |
| DELETE | `/roles/:id` | `RequirePermission(manage_roles)` | - |
| GET | `/permissions` | `RequirePermission(manage_roles)` | - |
| GET | `/roles/:id/permissions` | `RequirePermission(manage_roles)` | - |
| PUT | `/roles/:id/permissions` | `RequirePermission(manage_roles)` | `permission_ids` or `permissions` |
| PATCH | `/roles/:id/permissions` | `RequirePermission(manage_roles)` | `permission_ids` or `permissions` |
| POST | `/status` | `RequirePermission(manage_ticket_statuses)` | `status_name` |
| PATCH | `/status/:id` | `RequirePermission(manage_ticket_statuses)` | `status_name` |
| DELETE | `/status/:id` | `RequirePermission(manage_ticket_statuses)` | - |
| GET | `/departments/:id` | JWT | - |
| POST | `/departments` | `RequirePermission(manage_departments)` | `dep_name` |
| PATCH | `/departments/:id` | `RequirePermission(manage_departments)` | `dep_name` |
| DELETE | `/departments/:id` | `RequirePermission(manage_departments)` | - |
| POST | `/devices` | `RequirePermission(manage_devices)` | `dev_name`, `dev_description`, `dev_type` or aliases `name`, `description`, `device_type_id` |
| PUT | `/devices/:id` | `RequirePermission(manage_devices)` | device request body |
| PATCH | `/devices/:id` | `RequirePermission(manage_devices)` | device request body |
| DELETE | `/devices/:id` | `RequirePermission(manage_devices)` | - |
| POST | `/device-types` | `RequirePermission(manage_devices)` | `devicetype_name` |
| PATCH | `/device-types/:id` | `RequirePermission(manage_devices)` | `devicetype_name` |
| DELETE | `/device-types/:id` | `RequirePermission(manage_devices)` | - |
| POST | `/device-instances` | `RequirePermission(manage_devices)` | `device_id`, `device_number`, `dep_id` or `department_id`, `serial_number` |
| PUT | `/device-instances/:instanceID` | `RequirePermission(manage_devices)` | device instance request body |
| PATCH | `/device-instances/:instanceID` | `RequirePermission(manage_devices)` | device instance request body |
| DELETE | `/device-instances/:instanceID` | `RequirePermission(manage_devices)` | - |
| POST | `/issue-categories` | `RequirePermission(manage_issue_categories)` | `issues_name` |
| POST | `/issues-categories` | `RequirePermission(manage_issue_categories)` | `issues_name` |
| PATCH | `/issue-categories/:id` | `RequirePermission(manage_issue_categories)` | `issues_name` |
| PATCH | `/issues-categories/:id` | `RequirePermission(manage_issue_categories)` | `issues_name` |
| DELETE | `/issue-categories/:id` | `RequirePermission(manage_issue_categories)` | - |
| DELETE | `/issues-categories/:id` | `RequirePermission(manage_issue_categories)` | - |

## Notes

- The collection includes realistic JSON bodies based on actual structs and handler-local request structs.
- `GET /roles`, `GET /roles/:id`, `GET /status`, `GET /departments`, `GET /departments/:id`, and `GET /issue-categories` are protected by JWT because they are registered after `app.Use(jwtware...)`, but they do not have permission middleware in the current code.
- `GET /technician/summary` is also JWT-only in the current code.
- `GET /tickets/:ticketID` and `GET /tickets-detail/:ticketID` use permission checks but do not currently enforce ownership in the handler/repository.
