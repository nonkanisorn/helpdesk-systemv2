package domain

import "errors"
import "strings"

var ErrResourceInUse = errors.New("resource is in use")
var ErrDeviceSerialNotFound = errors.New("ไม่พบ Serial Number นี้ในระบบ")
var ErrDeviceUnavailable = errors.New("อุปกรณ์ไม่พร้อมใช้งาน")

func PublicErrorMessage(err error) string {
	if err == nil {
		return ""
	}
	return strings.TrimPrefix(err.Error(), ErrResourceInUse.Error()+": ")
}
