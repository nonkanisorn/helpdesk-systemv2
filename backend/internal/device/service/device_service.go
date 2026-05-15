package service

import "github.com/nonkanisorn/helpdesk-system/internal/device/repository"

type deviceService struct {
	deviceRepo repository.DeviceRepository
}

func NewDeviceService(deviceRepo repository.DeviceRepository) DeviceService {
	return &deviceService{deviceRepo: deviceRepo}
}

func (d deviceService) GetAllDevices() ([]DeviceResponse, error) {
	devices, err := d.deviceRepo.GetAll()
	if err != nil {
		return nil, err
	}

	deviceResponse := []DeviceResponse{}

	for _, device := range devices {
		deviceRes := DeviceResponse{
			ID:           device.ID,
			Name:         device.Name,
			DeviceTypeID: device.DeviceTypeID,
			Description:  device.Description,
		}

		deviceResponse = append(deviceResponse, deviceRes)
	}

	return deviceResponse, nil
}

func (d deviceService) CreateDevices(
	deviceName string,
	deviceDescription string,
	deviceTypeID int,
) error {
	err := d.deviceRepo.Create(
		deviceName,
		deviceDescription,
		deviceTypeID,
	)
	if err != nil {
		return err
	}

	return nil
}

func (d deviceService) DeleteDevices(deviceID int) error {
	err := d.deviceRepo.Delete(deviceID)
	if err != nil {
		return err
	}

	return nil
}
