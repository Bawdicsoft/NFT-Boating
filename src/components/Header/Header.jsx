import * as React from 'react';
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useContextAPI } from "../ContextAPI";
import { IntegrationWallets } from "../subComponents/IntegrationWallets";
import { MessageBox } from "../subComponents/MessageBox";
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import {
  CoinbaseWallet,
  fortmatic,
  Injected,
  portis,
} from "../wallets/Connectors";
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import "./header.css";

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
      <Navbar className="main-navbar" collapseOnSelect expand="lg" variant="dark">
        <Container>
          <Navbar.Brand style={{fontWeight:'bolder'}} href="#home">LOGO</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="m-auto">
              <Nav.Link className="nav-link" href="#features">Home</Nav.Link>
              <Nav.Link className="nav-link" href="#pricing">Buy Ownership</Nav.Link>
              <Nav.Link className="nav-link" href="#pricing">Booking</Nav.Link>

            </Nav>

            <Nav>
              <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <CurrencyBitcoinIcon style={{marginRight:'10px'}}></CurrencyBitcoinIcon>
                Dashboard
              </Button>
            </Nav>

            <Nav>
              <div >
                {active ? (
                  <button id='connect-wallet'
                    className="btn btn-primary"
                    title="Disconnect From Wallet"
                    onClick={disconnect}
                  >{`ChainID: ${chainId} 

                ${account.slice(0, 5)}...
                ${account.slice(
                    -5
                  )}`}</button>
                ) : (
                  <IntegrationWallets
                    connectToMetaMask={conToMetaMask}
                    connectToCoinBase={() => { activate(CoinbaseWallet) }}
                    connectToPortis={() => {
                      activate(portis);
                    }}
                    connectToFortmatic={() => {
                      activate(fortmatic);
                    }}
                  />
                )}
                {dealMessageBox === 'primary' &&
                  <MessageBox dealMessageBox={dealMessageBox} setDealMessageBox={setDealMessageBox} color="primary" show={show} MessageTitle="Wallet Connected" Message="Your wallet has been connected successfully" setShow={setShow} btnName="show message" />
                }
                {dealMessageBox === 'danger' &&
                  <MessageBox dealMessageBox={dealMessageBox} setDealMessageBox={setDealMessageBox} color="danger" show={show} MessageTitle="Wallet Disconnected" Message="Your wallet has been connected successfully" setShow={setShow} btnName="show message" />
                }
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container id="container">
        <h1>RENT A <br /> YACHT</h1>


      </Container>

    </div >

  </>);
};
