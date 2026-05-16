package domain

//	type DeviceRow struct {
//		DeviceID   int64  `db:"id"`
//		DeviceName string `db:"name"`
//		DeviceType int    `db:"dev_type_id"`
//	}
//
//	type Device struct {
//		DeviceID   int64
//		DeviceName string
//		DeviceType int
//	}
//
//	type DeviceResponse struct {
//		DeviceID          int64  `json:"dev_id"`
//		DeviceName        string `json:"dev_name"`
//		DeviceType        int    `json:"dev_type"`
//		DeviceDescription string `json:"dev_description"`
//	}
//
//	type DeviceRequset struct {
//		DeviceID          int64  `json:"dev_id"`
//		DeviceName        string `json:"dev_name"`
//		DeviceDescription string `json:"dev_description"`
//		DeviceType        int    `json:"dev_type"`
//	}
type DeviceRow struct {
	ID           int64   `db:"id"`
	Name         string  `db:"name"`
	DeviceTypeID int     `db:"device_type_id"`
	Description  *string `db:"description"`
}

type Device struct {
	ID           int64
	Name         string
	DeviceTypeID int
	Description  *string
}

type DeviceResponse struct {
	ID           int64   `json:"dev_id"`
	Name         string  `json:"dev_name"`
	DeviceTypeID int     `json:"dev_type"`
	Description  *string `json:"dev_description"`
}

type DeviceRequest struct {
	ID                int64   `json:"dev_id"`
	Name              string  `json:"dev_name"`
	NameAlias         string  `json:"name"`
	NewDeviceName     string  `json:"newdevicename"`
	Description       *string `json:"dev_description"`
	DescriptionAlias  *string `json:"description"`
	DeviceTypeID      int     `json:"dev_type"`
	DeviceTypeIDAlias int     `json:"device_type_id"`
}
