import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';

import { BrowserRouter } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { ContextProvider } from "./ContextAPI";
import Modal from "react-modal";



Modal.setAppElement("#root");

const getLibrary = (provider) => {
  return new ethers.providers.Web3Provider(provider);
};

const container = document.getElementById('root');
const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode> 
// );


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
