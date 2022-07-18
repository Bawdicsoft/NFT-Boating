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

  const FactoryAddress = "0xF60B991F0c08fd7779cD4d1Ee69389b99793bAc3";
  const USDTAddress = "0x3cDDe7A730A552897425D3d79CF773B3f711C3C1";

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

  const values = { ContractUSDT, ContractFactory, NFTYacht, provider };

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>;
};
