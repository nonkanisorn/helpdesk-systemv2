package service

import "github.com/nonkanisorn/helpdesk-system/internal/device/device_type/repository"

type deviceTypeService struct {
	DeviceTypeRepo repository.DeviceTypeRepository
}

func NewDeviceTypeService(DeviceTypeRepo repository.DeviceTypeRepository) DeviceTypeService {
	return deviceTypeService{DeviceTypeRepo: DeviceTypeRepo}
}

func (d deviceTypeService) GetAllDeviceType() ([]DeviceTypeResponse, error) {
	deviceTypes, err := d.DeviceTypeRepo.GetAll()
	if err != nil {
		return nil, err
	}
	deviceTypesRes := []DeviceTypeResponse{}
	for _, deviceType := range deviceTypes {
		devicetpye := DeviceTypeResponse{
			DeviceTypeID:   deviceType.DeviceTypeID,
			DeviceTypeName: deviceType.DeviceTypeName,
		}
		deviceTypesRes = append(deviceTypesRes, devicetpye)
	}
	return deviceTypesRes, nil
}
