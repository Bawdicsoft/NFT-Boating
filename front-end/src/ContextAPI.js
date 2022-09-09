import { useContext, useEffect, createContext, useState } from "react"
import { ethers } from "ethers"
import {
  Deploy,
  Factory,
  NFTYacht,
  USDT,
  NFTilityToken,
  NFTilityExchange,
} from "./ABIs/ABIs"
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
  const [user, loading] = useAuthState(auth)

  const DeployAddress = "0x081269944DCBbf6744C38A44687909830CCde51A"
  const FactoryAddress = "0x1Ffe832F1756B9e4Faa09F987E9D1A1cE825b76c"
  const USDTAddress = "0x3f3B1a663F659fb85158cf4242d1e23e236F47B6"
  const NFTilityTokenAddress = "0x9b59a220157f408156d8C344A84F26410D2EE738"
  const NFTilityExchangeAddress = "0x329306e74036CB4Cbb232E8E3E15A301e1098516"

  let provider
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum).getSigner()
  }

  const ContractDeploy = new ethers.Contract(DeployAddress, Deploy, provider)
  const ContractFactory = new ethers.Contract(FactoryAddress, Factory, provider)
  const ContractUSDT = new ethers.Contract(USDTAddress, USDT, provider)
  const ContractNFTilityToken = new ethers.Contract(
    NFTilityTokenAddress,
    NFTilityToken,
    provider
  )
  const ContractNFTilityExchange = new ethers.Contract(
    NFTilityExchangeAddress,
    NFTilityExchange,
    provider
  )

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
    ContractNFTilityToken,
    ContractNFTilityExchange,
    NFTYacht,
    provider,
    FactoryAddress,
    fetchUser,
    updateDocRequests,
    deleteDocRequests,
  }

  return <ContextAPI.Provider value={values}>{children}</ContextAPI.Provider>
}
