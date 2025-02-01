import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </StrictMode>
);
