package domain

import "errors"
import "strings"

var ErrResourceInUse = errors.New("resource is in use")
var ErrDeviceSerialNotFound = errors.New("ไม่พบ Serial Number นี้ในระบบ")
var ErrDeviceUnavailable = errors.New("อุปกรณ์ไม่พร้อมใช้งาน")
var ErrDuplicateSerialNumber = errors.New("รหัสอุปกรณ์ (Serial Number) นี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น")

func PublicErrorMessage(err error) string {
	if err == nil {
		return ""
	}
	return strings.TrimPrefix(err.Error(), ErrResourceInUse.Error()+": ")
}
