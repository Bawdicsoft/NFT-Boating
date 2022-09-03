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

  const DeployAddress = "0x32d95A97c6e0EB1bEC641efF7c042963d8bcE2e7"
  const FactoryAddress = "0x31F80884194EfdbCeEE74bdBB4DE8Bad5F76EfaB"
  const USDTAddress = "0x305007FF14723C49Dd383C7A4B048DBFc68EC8c4"
  const NFTilityTokenAddress = "0x4F1dD51C625E9c36CB71c8bB77C375a0100767B2"
  const NFTilityExchangeAddress = "0x5b761c98D5fdbc4ADE93B328e923E5d02B9E5468"

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
