import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { NFTYachtABI } from "./SmartContractABIs/SmartContractABIs";
import { Injected } from "./components/wallets/Connectors";
import { useWeb3React } from "@web3-react/core";

export const ContextAPI = React.createContext();

export const useContextAPI = () => {
  return useContext(ContextAPI);
};

export const ContextProvider = ({ children }) => {

  const {activate} = useWeb3React()

  const usdtAddress = "0x7570d1f890B1409cb026c8dcA69b5f0Bbb4F3846";
  const NFTYacht = "0x4F5d97CF9B3Ae95AcD2e10dB43eDfC9F453227CC";

  // const ContractAddress = '';
  const provider = new ethers.providers.Web3Provider(window.ethereum).getSigner()
  const Contract = new ethers.Contract(NFTYacht, NFTYachtABI, provider);

  useEffect(() => {
    const conToMetamask = async () => {
      await activate(Injected)
    }

    conToMetamask()
  },[])


  const values = { Contract };

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>;
};
