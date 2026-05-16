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
		deviceTypeRes := DeviceTypeResponse{
			ID:   deviceType.ID,
			Name: deviceType.Name,
		}

		deviceTypesRes = append(deviceTypesRes, deviceTypeRes)
	}

	return deviceTypesRes, nil
}

func (d deviceTypeService) CreateDeviceType(deviceTypeName string) error {
	return d.DeviceTypeRepo.Create(deviceTypeName)
}

func (d deviceTypeService) UpdateDeviceTypeByID(id int, deviceTypeName string) error {
	return d.DeviceTypeRepo.UpdateByID(id, deviceTypeName)
}

func (d deviceTypeService) DeleteDeviceTypeByID(id int) error {
	return d.DeviceTypeRepo.DeleteByID(id)
}
