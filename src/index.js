import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { NextUIProvider, Container } from '@nextui-org/react';
import App from "./App";


const rootElement = document.getElementById("root");

ReactDOM.render(
  <StrictMode>
    <NextUIProvider>
        <App />
    </NextUIProvider>
  </StrictMode>,
  rootElement
);
