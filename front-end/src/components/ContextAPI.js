import React, { useContext} from 'react';
import { useWeb3React } from '@web3-react/core';
import { RealEstateAbi } from './SmartContract/abi';
import {ethers} from "ethers";


export const ContextAPI = React.createContext()

export const useContextAPI = () => {
    return useContext(ContextAPI)
}

export const ContextProvider = ({children}) => {
    console.log("hello running");
    const ContractAddress = '0x6C9C6c06d236bE43C642711D9043B020424a1064';
    const provider = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const Contract = new ethers.Contract(ContractAddress, RealEstateAbi, provider);
    console.log(Contract);
    const {active , activate , deactivate , account , chainId} = useWeb3React()

    const baseUrl = 'http://localhost:5000'

    const values = {
        baseUrl,
        active,
        activate,
        deactivate,
        account,
        chainId
    }


    return (
    <ContextAPI.Provider value={values}>
        {children}
    </ContextAPI.Provider>
  )
}