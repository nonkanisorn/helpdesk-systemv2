import DeviceDetailPages from "../technician/DeviceDetailPages";

const ManagerDeviceDetailPages = () => (
  <DeviceDetailPages
    historyPath={(instanceId) => `/manager/instance/${instanceId}/history`}
  />
);

export default ManagerDeviceDetailPages;
