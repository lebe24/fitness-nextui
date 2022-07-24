import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { NextUIProvider} from '@nextui-org/react';
import Footer from "./components/Footer";
import App from "./App";


const rootElement = document.getElementById("root");

ReactDOM.render(
  <StrictMode>
    <NextUIProvider>
        <App />
        <Footer />
    </NextUIProvider>
  </StrictMode>,
  rootElement
);
