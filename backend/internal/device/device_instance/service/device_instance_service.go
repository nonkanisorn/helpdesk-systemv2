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
			ID:           device.ID,
			DeviceID:     device.DeviceID,
			SerialNumber: device.SerialNumber,
			DeviceNumber: device.DeviceNumber,
			DepartmentID: device.DepartmentID,
			Status:       device.Status,
		}

		deviceInstanceResponse = append(deviceInstanceResponse, deviceInstance)
	}

	return deviceInstanceResponse, nil
}

func (d deviceInstanceService) Create(deviceID int, departmentID *int, serialNumber string) error {
	err := d.deviceInstanceRepo.Create(deviceID, departmentID, serialNumber)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceInstanceService) UpdateDeviceInstanceByID(id int, departmentID *int, serialNumber string, status string) error {
	err := d.deviceInstanceRepo.UpdateDeviceInstanceByID(id, departmentID, serialNumber, status)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceInstanceService) DeleteDeviceInstanceByID(id int) error {
	err := d.deviceInstanceRepo.DeleteDeviceInstanceByID(id)
	if err != nil {
		return err
	}

	return nil
}
