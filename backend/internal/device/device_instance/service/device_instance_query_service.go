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
			ID:                *v.ID,
			InstanceID:        *v.ID,
			DeviceID:          v.DeviceID,
			SerialNumber:      v.SerialNumber,
			DeviceNumber:      v.DeviceNumber,
			DepartmentID:      v.DepartmentID,
			DepartmentIDAlias: v.DepartmentID,
		})
	}

	return devicesInstance
}

func ToHistoryRepairDeviceInstanceResponse(h []domain.HistoryRepairDeviceInstance) []domain.HistoryRepairDeviceInstanceResponse {
	var devicesInstanceRes []domain.HistoryRepairDeviceInstanceResponse

	for _, v := range h {
		devicesInstanceRes = append(devicesInstanceRes, domain.HistoryRepairDeviceInstanceResponse{
			ID:               v.ID,
			Title:            v.Title,
			Description:      v.Description,
			ResolutionNote:   v.ResolutionNote,
			IssueCategoryID:  v.IssueCategoryID,
			DeviceInstanceID: v.DeviceInstanceID,
			UserID:           v.UserID,
			TechnicianID:     v.TechnicianID,
			ManagerID:        v.ManagerID,
			StatusID:         v.StatusID,
			CreatedAt:        v.CreatedAt,
			AssignedAt:       v.AssignedAt,
			StartedAt:        v.StartedAt,
			CompletedAt:      v.CompletedAt,
			ClosedAt:         v.ClosedAt,
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
		ID: deviceInstanceID,
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
