package service

import "github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/repository"

type deviceInstanceService struct {
	deviceInstanceRepo repository.DeviceInstanceRepository
}

func NewDeviceInstanceService(deviceInstanceRepo repository.DeviceInstanceRepository) DeviceInstanceService {
	return deviceInstanceService{deviceInstanceRepo: deviceInstanceRepo}
}

func (d deviceInstanceService) GetAllDeviceInstance() ([]DeviceInstanceResponse, error) {
	deviceInstances, err := d.deviceInstanceRepo.GetAll()
	if err != nil {
		return nil, err
	}
	deviceInstanceResponse := []DeviceInstanceResponse{}
	for _, device := range deviceInstances {
		deviceInstance := DeviceInstanceResponse{
			DeviceInstanceID: device.DeviceInstanceID,
			DeviceID:         device.DeviceID,
			SerialNumber:     device.SerialNumber,
			DeviceName:       device.DeviceName,
			DepID:            device.DepID,
		}
		deviceInstanceResponse = append(deviceInstanceResponse, deviceInstance)
	}
	return deviceInstanceResponse, nil
}
