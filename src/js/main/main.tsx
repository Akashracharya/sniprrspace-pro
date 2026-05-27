import React from "react";
import ReactDOM from "react-dom/client";
import IndexReact from "./index-react";
import "./main.scss"; // Imports your styles

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IndexReact />
  </React.StrictMode>
);