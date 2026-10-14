import "@mui/material/styles/styled";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { appTheme } from "./theme";
// import "@emotion/styled"; // ✅ Force Vite to include it
// import styled from "styled-components";

import { store } from "./store/store";
import { Provider } from "react-redux";
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "./dev/index.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <Provider store={store}>
        <BrowserRouter>
          <DevSupport
            ComponentPreviews={ComponentPreviews}
            useInitialHook={useInitial}
          >
            <App />
          </DevSupport>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
);
