import InstanceDeviceHistoryPage from "../technician/InstanceDeviceHistoryPage";

const ManagerInstanceDeviceHistoryPage = () => (
  <InstanceDeviceHistoryPage
    ticketDetailPath={(ticketId) => `/manager/ticketdetail/${ticketId}`}
  />
);

export default ManagerInstanceDeviceHistoryPage;
