import React, {useContext} from 'react';
import { useWeb3React } from '@web3-react/core';
import { RealEstateAbi } from './SmartContract/abi';
import {ethers} from "ethers";


export const ContextAPI = React.createContext()

export const useContextAPI = () => {
    return useContext(ContextAPI)
}

export const ContextProvider = ({children}) => {
    console.log("hello running");
    const ContractAddress = '0xB727a8AF43580366dEe14aEd4bDD1f562D2169D5';
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