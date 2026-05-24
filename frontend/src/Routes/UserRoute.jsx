// import React from "react";
// import { Box } from "@mui/material";
// import { Route, Routes } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Sidebaruser from "../layout/users/Sidebaruser";
// import Headerbaruser from "../layout/users/Headerbaruser";
// import User from "../components/user/User";
// import Addcase from "../components/user/Addcase";
// import Historyrepair from "../components/user/Historyrepair";
// import Deletecase from "../components/user/Deletecase";
// import Notfound404 from "../components/Notfound404";
// import { useNavigate } from "react-router-dom";
// import Sidebartech from "../layout/tech/Sidebartech";
// import Headerbartech from "../layout/tech/Headerbartech";
// import Statuscase from "../components/user/Statuscase";
// import Detailcasefinish from "../components/user/Detailcasefinish";
// import Detailcase from "../components/Detailcase";
// const UserRoute = ({ children }) => {
//   const navigate = useNavigate();
//   const { user } = useSelector((state) => ({ ...state }));
//   // return user && user.token ? children : <h1>No Login</h1>
//   return user?.token ? (
//     <div className="app">
//       {/* <Sidebaruser /> */}
//       <main className="content" style={{ backgroundColor: "#F5F6Fa" }}>
//         <Headerbaruser />
//         <Box m="19px">
//           <Routes>
//             <Route path="" element={<User />} />
//             <Route path="repair-request" element={<Addcase />} />
//             <Route path="repair-history" element={<Historyrepair />} />
//             <Route path="deleteticket" element={<Deletecase />} />
//             <Route path="statusticket" element={<Statuscase />} />
//             <Route path="repair-detail/:ticket_id" element={<Detailcase />} />
//             <Route
//               path="Detailticketfinish/:ticket_id"
//               element={<Detailcasefinish />}
//             />
//             <Route path="*" element={<Notfound404 />} />
//           </Routes>
//         </Box>
//       </main>
//     </div>
//   ) : (
//     navigate("/login")
//   );
// };
//
// export default UserRoute;
import React from "react";
import { Box } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Headerbaruser from "../layout/users/Headerbaruser";
import User from "../components/user/User";
import Addcase from "../components/user/Addcase";
import Historyrepair from "../components/user/Historyrepair";
import Deletecase from "../components/user/Deletecase";
import Notfound404 from "../components/Notfound404";
import Statuscase from "../components/user/Statuscase";
import Detailcasefinish from "../components/user/Detailcasefinish";
import Detailcase from "../components/Detailcase";
import { hasAnyPermission } from "../auth/permissions";

const UserRoute = () => {
  const user = useSelector((state) => state.user);

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  if (
    !hasAnyPermission(user.permissions, [
      "create_ticket",
      "view_own_ticket",
      "confirm_repair",
    ])
  ) {
    return <Notfound404 statusCode={403} />;
  }

  return (
    <Box
      sx={{
        height: "100dvh",
        bgcolor: "#F5F6Fa",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Headerbaruser />

      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          p: { xs: 2, sm: 3 },
          pb: {
            xs: "calc(96px + env(safe-area-inset-bottom))",
            sm: 6,
          },
          boxSizing: "border-box",
        }}
      >
        <Routes>
          <Route path="" element={<User />} />
          <Route path="repair-request" element={<Addcase />} />
          <Route path="repair-history" element={<Historyrepair />} />
          <Route path="deleteticket" element={<Deletecase />} />
          <Route path="statusticket" element={<Statuscase />} />
          <Route path="repair-detail/:ticket_id" element={<Detailcase />} />
          <Route
            path="Detailticketfinish/:ticket_id"
            element={<Detailcasefinish />}
          />
          <Route path="*" element={<Notfound404 />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default UserRoute;
