import { useContext, useEffect, createContext } from "react";
import { ethers } from "ethers";
import { Factory, NFTYacht, USDT } from "./ABIs/ABIs";
import { Injected } from "./Comp/Wallets/Connectors";
import { useWeb3React } from "@web3-react/core";

export const ContextAPI = createContext();

export const useContextAPI = () => {
  return useContext(ContextAPI);
};

export const ContextProvider = ({ children }) => {
  const { activate, account } = useWeb3React();

  const FactoryAddress = "0xa8dB91a4D20299d4a1EfB021065919363B0784b3";
  const USDTAddress = "0x6711DF95D1Dcd92f7e0E84E199dE7c51088d037B";

  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  ).getSigner();

  const ContractFactory = new ethers.Contract(
    FactoryAddress,
    Factory,
    provider
  );
  const ContractUSDT = new ethers.Contract(USDTAddress, USDT, provider);

  useEffect(() => {
    const conToMetamask = async () => {
      await activate(Injected);
    };
    conToMetamask();
  }, []);

  const values = {
    ContractUSDT,
    ContractFactory,
    NFTYacht,
    provider,
    FactoryAddress
  };

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>;
};
