import { Link } from "react-router-dom";
import "./Header.scss";
import Dropdown from "./Dropdown/Dropdown";
import React from "react";


function Header() {
  return (
    <div className="Header">
      <div className="Container">
        <h1>Header</h1>
        <div className="Nav">
          <div className="naveLink">
            <Link to="/">Home</Link>
            <Link to="/BuyNFT">BuyNFT</Link>
            <Link to="/booking">Booking</Link>
            <Link to="/Dashboard">Dashboard</Link>
            <Link to="/single-page">Single Page</Link>
          </div>

          <Dropdown />
        </div>
      </div>
    </div>
  );
}

export default Header;
