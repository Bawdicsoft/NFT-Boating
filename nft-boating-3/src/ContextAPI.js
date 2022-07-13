import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { NFTYachtABI, USDTABI } from "./SmartContractABIs/SmartContractABIs";
import { Injected } from "./components/wallets/Connectors";
import { useAuthState } from "react-firebase-hooks/auth";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import { auth, db, signInWithGoogle } from "./DB/firebase-config";
import { query, collection, getDocs, where } from "firebase/firestore";
import { saveUser } from "./features/User/UserSlice";


export const ContextAPI = React.createContext();

export const useContextAPI = () => {
  return useContext(ContextAPI);
};

export const ContextProvider = ({ children }) => {
  const { activate, account } = useWeb3React();
  const dispatch = useDispatch();
  const [user, loading, error] = useAuthState(auth);


  const usdtAddress = "0x6711DF95D1Dcd92f7e0E84E199dE7c51088d037B";
  const NFTYacht = "0x31bc944d5A6A6beB34371a737C7cF9982bE38c88";

  // const ContractAddress = '';
  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  ).getSigner();
  const ContractYacht = new ethers.Contract(NFTYacht, NFTYachtABI, provider);
  const ContractUSDT = new ethers.Contract(usdtAddress, USDTABI, provider);

  useEffect(() => {
    const conToMetamask = async () => {
      await activate(Injected);
    };
    conToMetamask();
  }, []);

  

  const [UserData, setUserData] = useState();

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
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      console.log({ data });
      dispatch(saveUser(data));
    } catch (err) {
      console.error(err);
    }
  };


  const values = { ContractYacht, ContractUSDT, NFTYacht };

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>;
};
