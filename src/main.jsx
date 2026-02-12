import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import { store } from "./store";
import { DialogContainer } from "./common-components/DialogContainer.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <DialogContainer />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
