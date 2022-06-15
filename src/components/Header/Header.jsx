import * as React from 'react';
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Navbarr from './Navbar'
import { useContextAPI } from "../ContextAPI";
import { IntegrationWallets } from "../subComponents/IntegrationWallets";
import { MessageBox } from "../subComponents/MessageBox";
import Button from '@mui/material/Button';
import ethLogo from '../Assets/ethLogo.png';
import {
  CoinbaseWallet,
  fortmatic,
  Injected,
  portis,
} from "../wallets/Connectors";
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import "./header.css";
import { log } from 'util';


// Be sure to include styles at some point, probably during your bootstraping

export const Header = () => {
  const [dealMessageBox, setDealMessageBox] = useState()
  const [show, setShow] = useState(false);
  const {
    userInfo,
    setUserInfo,
    active,
    activate,
    deactivate,
    account,
    chainId,
  } = useContextAPI();

  console.log(chainId)

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);




  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  async function conToMetaMask() {


    if (typeof window.ethereum == "undefined") {
      alert("MetaMask is Not installed!");
    }
    await activate(Injected);

    setShow(true)
    setDealMessageBox('primary')
  }

  const disconnect = async () => {
    deactivate(Injected);

    setShow(true)
    setDealMessageBox('danger')

  };


  const logout = () => {
    disconnect();
    sessionStorage.removeItem("userinfo");
    setUserInfo("");
  };

  return (<>
    <div id="banner-image">
      
    <Navbarr/>
      <Container id="container">
        <h1>RENT A <br /> YACHT</h1>


      </Container>

    </div >

  </>);
};
