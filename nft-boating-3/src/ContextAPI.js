import React, { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { NFTYachtABI, USDTABI } from "./SmartContractABIs/SmartContractABIs";
import { Injected } from "./components/wallets/Connectors";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import { useAuthState } from "react-firebase-hooks/auth";
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


  const usdtAddress = "0x3cDDe7A730A552897425D3d79CF773B3f711C3C1";
  const NFTYacht = "0xEEf40717d140A1D9Bceb0Ff474F12FeA63D78fF9";

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
      // console.log(doc.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const data = doc.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      dispatch(saveUser(data));
      console.log("userID", data[0].id);
    } catch (err) {
      console.error(err);
    }
  };


  const values = { ContractYacht, ContractUSDT, NFTYacht };

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>;
};
