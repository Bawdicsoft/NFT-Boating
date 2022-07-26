import React, { useState } from 'react';
import { Container, Nav, Navbar } from "react-bootstrap";
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
import "./header.css";

const DarkNavbar = () => {
  const [dealMessageBox, setDealMessageBox] = useState()
  const [show, setShow] = useState(false);
  const {
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

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

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


  // const logout = () => {
  //   disconnect();
  //   sessionStorage.removeItem("userinfo");
  //   setUserInfo("");
  // };
  return (
    <div>
      <Navbar style={{ backgroundColor: '#1A1A40' }} className="main-navbar" collapseOnSelect expand="lg" variant="dark">
        <Container>
          <Navbar.Brand style={{ fontWeight: 'bolder' }} href="#home">LOGO</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="m-auto">
              <Nav.Link className="nav-link" href="/">HOME</Nav.Link>
              <Nav.Link className="nav-link" href="/ownership">OWNERSHIP</Nav.Link>
              <Nav.Link className="nav-link" href="/booking">BOOKING</Nav.Link>
            </Nav>

            <Nav style={{ display: 'flex', flexDirection: 'row' }}>
              <Button
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? 'composition-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                {/* <CurrencyBitcoinIcon style={{marginRight:'10px'}}></CurrencyBitcoinIcon> */}
                {chainId === 1 ?
                  <>
                    <img style={{ marginRight: '10px' }} width="15px" src={ethLogo} alt="" srcset="" />
                    Mainnet
                  </> :
                  <>
                    None
                  </>}
              </Button>
              <div >
                {active ? (
                  <button id='connect-wallet'
                    className="btn btn-primary"
                    title="Disconnect From Wallet"
                    onClick={disconnect}
                  >{`

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
    </div>
  );
}

export default DarkNavbar;
