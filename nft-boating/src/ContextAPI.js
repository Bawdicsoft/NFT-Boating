import { useContext, useEffect, createContext, useState } from "react";
import { ethers } from "ethers";
import { Factory, NFTYacht, USDT } from "./ABIs/ABIs";
import { Injected } from "./Comp/Wallets/Connectors";
import { useWeb3React } from "@web3-react/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, signInWithGoogle } from "./DB/firebase-config";
import { query, collection, getDocs, where } from "firebase/firestore";

export const ContextAPI = createContext();

export const useContextAPI = () => {
  return useContext(ContextAPI);
};

export const ContextProvider = ({ children }) => {
  const { activate, account } = useWeb3React();
  const [user, loading, error] = useAuthState(auth);

  const FactoryAddress = "0x4A309BB74778E2aE1259B5e91588a268E1083DEb";
  const USDTAddress = "0x65C89088C691841D55263E74C7F5cD73Ae60186C";

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

  const [UserData, setUserData] = useState();

  console.log({ UserData });

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    } else {
      fetchUserName();
    }
  }, [user, loading]);

  const fetchUserName = async () => {
    try {
      console.log({ user });
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      // console.log(doc.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const data = doc.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setUserData(data);
      console.log("userID", data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const values = {
    ContractUSDT,
    ContractFactory,
    NFTYacht,
    provider,
    FactoryAddress
  };

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>;
};
