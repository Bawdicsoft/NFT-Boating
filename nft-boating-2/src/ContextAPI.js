import { useContext, useEffect, createContext, useState } from "react"
import { ethers } from "ethers"
import { Deploy, Factory, NFTYacht, USDT } from "./ABIs/ABIs"
import { Injected } from "./Comp/Wallets/Connectors"
import { useWeb3React } from "@web3-react/core"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "./DB/firebase-config"
import {
  query,
  collection,
  getDocs,
  where,
  updateDoc,
  doc,
} from "firebase/firestore"

export const ContextAPI = createContext()

export const useContextAPI = () => {
  return useContext(ContextAPI)
}

export const ContextProvider = ({ children }) => {
  const { activate, account } = useWeb3React()
  const [user, loading, error] = useAuthState(auth)

  const DeployAddress = "0x98778C309A950e9e7F0b7A20940C799E5AFaD59b"
  const FactoryAddress = "0xa95e737Ede9624292EaC1FEEB985BD99EA7369ca"
  const USDTAddress = "0x65C89088C691841D55263E74C7F5cD73Ae60186C"

  const provider = new ethers.providers.Web3Provider(
    window.ethereum
  ).getSigner()

  const ContractDeploy = new ethers.Contract(DeployAddress, Deploy, provider)
  const ContractFactory = new ethers.Contract(FactoryAddress, Factory, provider)
  const ContractUSDT = new ethers.Contract(USDTAddress, USDT, provider)

  useEffect(() => {
    const conToMetamask = async () => {
      await activate(Injected)
    }
    conToMetamask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const [UserData, setUserData] = useState()

  console.log({ UserData })

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return
    } else {
      fetchUserName()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])
  console.log(error)

  const fetchUserName = async () => {
    try {
      console.log({ user })
      const q = query(collection(db, "users"), where("uid", "==", user?.uid))
      const doc = await getDocs(q)
      // console.log(doc.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const data = doc.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      setUserData(data)
      console.log("userID", data[0].id)
    } catch (err) {
      console.error(err)
    }
  }

  const updateDocRequests = (collection, object) => {
    const fieldToEdit = doc(db, collection, UserData[0].id)
    return updateDoc(fieldToEdit, object)
  }

  const values = {
    ContractUSDT,
    ContractDeploy,
    ContractFactory,
    NFTYacht,
    provider,
    FactoryAddress,
    updateDocRequests,
  }

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>
}
