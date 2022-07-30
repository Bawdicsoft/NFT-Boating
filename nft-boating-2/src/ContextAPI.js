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
  const { activate, account } = useWeb3React()
  const [user, loading, error] = useAuthState(auth)

  const DeployAddress = "0xe5e9B33EcAbB40469eD34220110D3E1E0aa0Ffe0"
  const FactoryAddress = "0x14f94e170BfeE7a274d3B3ED07B361f67D46A1A4"
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

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return
    } else {
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
    const fieldToEdit = doc(db, collection, UserData.id)
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
    NFTYacht,
    provider,
    FactoryAddress,
    fetchUser,
    updateDocRequests,
    deleteDocRequests,
  }

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>
}
