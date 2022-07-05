import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { ContextProvider } from "./ContextAPI";
import { Provider } from "react-redux";
import { store } from "./store/store";

const getLibrary = (provider) => {
  return new ethers.providers.Web3Provider(provider);
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ContextProvider>
          <App />
        </ContextProvider>
      </Provider>
    </Web3ReactProvider>
  </BrowserRouter>
);
