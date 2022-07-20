import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ethers } from "ethers";
import { HashRouter } from "react-router-dom";
import { ContextProvider } from "./ContextAPI";
import { Web3ReactProvider } from "@web3-react/core";

const root = ReactDOM.createRoot(document.getElementById("root"));

const getLibrary = provider => {
  return new ethers.providers.Web3Provider(provider);
};

root.render(
  <HashRouter>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </Web3ReactProvider>
  </HashRouter>
);
