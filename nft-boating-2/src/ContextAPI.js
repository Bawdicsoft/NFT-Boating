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
  deleteField,
} from "firebase/firestore"

export const ContextAPI = createContext()

export const useContextAPI = () => {
  return useContext(ContextAPI)
}

export const ContextProvider = ({ children }) => {
  const { activate, account, active } = useWeb3React()
  const [user, loading, error] = useAuthState(auth)

  const DeployAddress = "0x1C43fd747b973089Ba7747Ec5F116f38c86BCc9f"
  const FactoryAddress = "0x49aaD763dA7A1e07c0B7a0880527D7f915fe5579"
  const USDTAddress = "0x65C89088C691841D55263E74C7F5cD73Ae60186C"

  let provider
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum).getSigner()
  }

  const ContractDeploy = new ethers.Contract(DeployAddress, Deploy, provider)
  const ContractFactory = new ethers.Contract(FactoryAddress, Factory, provider)
  const ContractUSDT = new ethers.Contract(USDTAddress, USDT, provider)

  var wsProvider = new ethers.providers.JsonRpcProvider(
    "wss://rinkeby.infura.io/ws/v3/461d35d8280c4ee78f25da15fdcc48c1",
    "rinkeby"
  )
  console.log()
  const wsp = new ethers.providers.WebSocketProvider([
    "wss://rinkeby.infura.io/ws/v3/461d35d8280c4ee78f25da15fdcc48c1"["rinkeby"],
  ])
  console.log(wsp)
  const readContractFactory = new ethers.Contract(FactoryAddress, Factory, wsp)

  // useEffect(() => {
  //   if (isconnected) {
  //     const conToMetamask = async () => {
  //       await activate(Injected)
  //     }
  //     conToMetamask()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])
  // console.log(isconnected, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>isconnected")

  const [UserData, setUserData] = useState()

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return
    } else if (user) {
      fetchUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading])
  console.log(error)

  const fetchUser = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid))
      const doc = await getDocs(q)
      const data = doc.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

      setUserData(data[0])
    } catch (err) {
      console.error(err)
    }
  }

  const updateDocRequests = (collection, object) => {
    const fieldToEdit = doc(db, collection, UserData?.id)
    return updateDoc(fieldToEdit, object)
  }

  const deleteDocRequests = (collection, fieldName) => {
    const fieldToEdit = doc(db, collection, UserData.id)
    return updateDoc(fieldToEdit, { fieldName: deleteField() })
  }

  const values = {
    UserData,
    ContractUSDT,
    ContractDeploy,
    ContractFactory,
    readContractFactory,
    NFTYacht,
    provider,
    FactoryAddress,
    fetchUser,
    updateDocRequests,
    deleteDocRequests,
  }

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>
}
