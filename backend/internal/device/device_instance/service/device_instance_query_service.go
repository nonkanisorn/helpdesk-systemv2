package service

import (
	"github.com/nonkanisorn/helpdesk-system/internal/device/device_instance/repository"
	"github.com/nonkanisorn/helpdesk-system/internal/domain"
)

type deviceInstanceQueryService struct {
	deviceInstanceRepo repository.DeviceInstanceQueryRepository
}

func NewDeviceInstanceQueryService(deviceInstanceRepo repository.DeviceInstanceQueryRepository) DeviceInstanceQueryService {
	return deviceInstanceQueryService{deviceInstanceRepo: deviceInstanceRepo}
}

func ToResponse(d []domain.DeviceInstance) []domain.DeviceInstanceResponse {
	var devicesInstance []domain.DeviceInstanceResponse
	for _, v := range d {
		devicesInstance = append(devicesInstance, domain.DeviceInstanceResponse{
			DeviceInstanceID: *v.DeviceInstanceID,
			DeviceID:         v.DeviceID,
			SerialNumber:     v.SerialNumber,
			DeviceName:       v.DeviceName,
			DepID:            v.DepID,
		})
	}
	return devicesInstance
}

func ToHistoryRepairDeviceInstanceResponse(h []domain.HistoryRepairDeviceInstance) []domain.HistoryRepairDeviceInstanceResponse {
	var devicesInstanceRes []domain.HistoryRepairDeviceInstanceResponse
	for _, h := range h {
		devicesInstanceRes = append(devicesInstanceRes, domain.HistoryRepairDeviceInstanceResponse{
			TicketID:          h.TicketID,
			Description:       h.Description,
			ResolutionNote:    h.ResolutionNote,
			IssueCategoriesID: h.IssueCategoriesID,
			InstanceID:        h.InstanceID,
			UserID:            h.UserID,
			TechnicianID:      h.TechnicianID,
			ManagerID:         h.ManagerID,
			StatusID:          h.StatusID,
			CreatedAt:         h.CreatedAt,
			AssignedAt:        h.AssignedAt,
			StartedAt:         h.StartedAt,
			CompletedAt:       h.CompletedAt,
			ClosedAt:          h.ClosedAt,
		})
	}
	return devicesInstanceRes
}

func (d deviceInstanceQueryService) CheckSerialNumber(serialNumber string) (*domain.DeviceInstanceResponse, error) {
	deviceInstanceID, err := d.deviceInstanceRepo.CheckSerialNumber(serialNumber)
	if err != nil {
		return nil, err
	}
	deviceInstanceIDResponse := domain.DeviceInstanceResponse{
		DeviceInstanceID: deviceInstanceID,
	}

	return &deviceInstanceIDResponse, nil
}

func (d deviceInstanceQueryService) GetDeviceInstanceByDeviceID(deviceID int) ([]domain.DeviceInstanceResponse, error) {
	devicesInstanceFromDB, err := d.deviceInstanceRepo.GetDeviceInstanceByDeviceID(deviceID)
	if err != nil {
		return nil, err
	}
	devicesInstance := ToResponse(devicesInstanceFromDB)
	return devicesInstance, nil
}

func (d deviceInstanceQueryService) GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID int) ([]domain.HistoryRepairDeviceInstanceResponse, error) {
	deviceInstanceRows, err := d.deviceInstanceRepo.GetHistoryRepairDeviceInstanceByDeviceInstanceID(deviceInstanceID)
	if err != nil {
		return nil, err
	}
	deviceInstanceRes := ToHistoryRepairDeviceInstanceResponse(deviceInstanceRows)
	return deviceInstanceRes, nil
}
