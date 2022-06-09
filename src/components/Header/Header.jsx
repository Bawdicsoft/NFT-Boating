import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useContextAPI } from "../ContextAPI";
import { IntegrationWallets } from "../subComponents/IntegrationWallets";
import { MessageBox } from "../subComponents/MessageBox";
import {
  CoinbaseWallet,
  fortmatic,
  Injected,
  portis,
} from "../wallets/Connectors";

import "./header.css";

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
    <Navbar collapseOnSelect expand="lg"  variant="dark">
      <Container>
        <Navbar.Brand href="#home">Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="m-auto">
            <Nav.Link href="#features">Home</Nav.Link>
            <Nav.Link href="#pricing">Buy Ownership</Nav.Link>
            <Nav.Link href="#pricing">Booking</Nav.Link>
          </Nav>
          <Nav>
            <div >
              {active ? (
                <button
                  className="btn btn-primary py-2"
                  title="Disconnect From Wallet"
                  onClick={disconnect}
                >{`ChainID: ${chainId} ${account.slice(0, 5)}...${account.slice(
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
              <MessageBox dealMessageBox={dealMessageBox} setDealMessageBox={setDealMessageBox} color="primary" show={show} MessageTitle="Wallet Connected" Message="Your wallet has been connected successfully" setShow={setShow} btnName="show message"/>
              }
              {dealMessageBox === 'danger' &&
              <MessageBox dealMessageBox={dealMessageBox} setDealMessageBox={setDealMessageBox} color="danger" show={show} MessageTitle="Wallet Disconnected" Message="Your wallet has been connected successfully" setShow={setShow} btnName="show message"/>
              }
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Container id="container">
              <h1>RENT A YACHT</h1>

    </Container>

  </div>

    </>);
};
