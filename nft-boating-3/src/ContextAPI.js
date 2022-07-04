import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { NFTYachtABI } from "./SmartContractABIs/SmartContractABIs";
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


  // const usdtAddress = "0x7570d1f890B1409cb026c8dcA69b5f0Bbb4F3846";
  const NFTYacht = "0x4F5d97CF9B3Ae95AcD2e10dB43eDfC9F453227CC";

  // const ContractAddress = '';
  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  ).getSigner();
  const Contract = new ethers.Contract(NFTYacht, NFTYachtABI, provider);



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
      alert(`${user?.uid}`);
      alert(`${err}`);
    }
  };


  useEffect(() => {
    const conToMetamask = async () => {
      await activate(Injected);
    };
    conToMetamask();
  }, []);

  const values = { Contract };

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>;
};
