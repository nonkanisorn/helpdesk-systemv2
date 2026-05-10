package domain

type DeviceRow struct {
	DeviceID   int64  `db:"dev_id"`
	DeviceName string `db:"dev_name"`
	DeviceType int    `db:"dev_type"`
}
type Device struct {
	DeviceID   int64
	DeviceName string
	DeviceType int
}
type DeviceResponse struct {
	DeviceID          int64  `json:"dev_id"`
	DeviceName        string `json:"dev_name"`
	DeviceType        int    `json:"dev_type"`
	DeviceDescription string `json:"dev_description"`
}
type DeviceRequset struct {
	DeviceID          int64  `json:"dev_id"`
	DeviceName        string `json:"dev_name"`
	DeviceDescription string `json:"dev_description"`
	DeviceType        int    `json:"dev_type"`
}
