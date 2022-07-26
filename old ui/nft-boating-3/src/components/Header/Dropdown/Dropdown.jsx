import "./Dropdown.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, signInWithGoogle } from "../../../DB/firebase-config";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useWeb3React } from "@web3-react/core";
import { Injected } from "../../wallets/Connectors";
import { useSelector } from "react-redux";


import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function Dropdown() {

  return (
    <Navbar>
      <span>
        {/* {account.slice(0, 5)}...{account.slice(-5)} */}
      </span>
      <NavItem profile="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541">
        <DropdownMenu></DropdownMenu>
      </NavItem>
    </Navbar>
  );
}

function Navbar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{props.children}</ul>
    </nav>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  // const handleClose = () => {
  //   setOpen(false)
  // }
  return (
    <li className="nav-item">
      {/* <a href="#" className="img-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a> */}

      <img
        className="img-button"
        onClick={() => setOpen(!open)}
        src={props.profile}
        alt=""
      />

      {open && props.children}
    </li>
  );
}

function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const state = useSelector((state) => state);

  
  const dropdownRef = useRef(null);

  const { activate, active, account } = useWeb3React();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const logout = async () => {
    console.log("clicked");
    await signOut(auth);
    setName('')
  };


  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    // if (user) navigate("/");
  }, [user, loading]);

  const conToMetaMask = async () => {
    try {
      await activate(Injected);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      
      console.log({ data });
      setName(data.name);
    } catch (err) {
      console.error(err);
      // alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    fetchUserName();
  }, [user, loading]);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, [])

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    return (
      <button
        className="menu-item"
        // onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
        onClick={props.onClick}
      >
        <span className="img-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </button>
    );
  }
  return (
    <div className="dropdown"  ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          {name ? (
            <DropdownItem leftIcon="🦧">{name}</DropdownItem>
          ) : ("")}

          {active ? (
            <DropdownItem leftIcon="🦧">
              {" "}
              {account.slice(0, 5)}...{account.slice(-5)}{" "}
            </DropdownItem>
          ) : (
            <DropdownItem leftIcon="🦧" onClick={conToMetaMask}>
              {" "}
              Connect MetaMask{" "}
            </DropdownItem>
          )}

          {name ? (
            <DropdownItem leftIcon="🦧" onClick={logout}>
              Log Out
            </DropdownItem>
          ) : (
            <DropdownItem leftIcon="🦧" onClick={signInWithGoogle}>
              {" "}
              Login with Google{" "}
            </DropdownItem>
          )}

          {/* <p>
            Logged in as
            <span>{name}</span>
            <span>{user?.email}</span>
          </p> */}
          {/* <button onClick={signInWithGoogle}>Login with Google</button>
          <button onClick={logout}>Logout with Google</button>
          {active ? (
            <button>{account}</button>
          ) : (
            <button onClick={conToMetaMask}>Connect MetaMask</button>
          )} */}

          {/* <DropdownItem leftIcon="🦧" rightIcon=">" goToMenu="animals">
            Animals
          </DropdownItem> */}
        </div>
      </CSSTransition>

      {/* <CSSTransition
        in={activeMenu === "settings"}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon=">">
            <h2>My Tutorial</h2>
          </DropdownItem>
          <DropdownItem leftIcon="🐸">HTML</DropdownItem>
          <DropdownItem leftIcon="🐸">CSS</DropdownItem>
          <DropdownItem leftIcon="🐸">JavaScript</DropdownItem>
          <DropdownItem leftIcon="🐸">Awesome!</DropdownItem>
        </div>
      </CSSTransition> */}

      {/* <CSSTransition
        in={activeMenu === "animals"}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon=">">
            <h2>Animals</h2>
          </DropdownItem>
          <DropdownItem leftIcon="🦘">Kangaroo</DropdownItem>
          <DropdownItem leftIcon="🐸">Frog</DropdownItem>
          <DropdownItem leftIcon="🦋">Horse?</DropdownItem>
          <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
        </div>
      </CSSTransition> */}
    </div>
  );
}

export default Dropdown;