import { Link } from "react-router-dom";
import "./Footer.scss";
import { ReactComponent as Facebook } from "../../Assets/Icon/icons8-facebook-30.svg";
import { ReactComponent as Instagram } from "../../Assets/Icon/icons8-instagram-30.svg";
import React from "react";

function Footer() {
  return (
    <div className="Footer">
      <div className="Container useful-links">
        <ul>
          <li>Support</li>
          <li>About</li>
          <li>Experience</li>
          <li>Connect</li>
          <li>Terms & Polices</li>

        </ul>
        <ul>
          <li>Contact</li>
          <li>Address: home city, country postCode</li>
          <li>Email: info@nftyacht.com</li>
          <li>Phone: +9233******</li>
          <li>
              <Facebook className="sm-icons" />
              <Instagram className="sm-icons"/>
              <Facebook className="sm-icons"/>
          </li>
          {/* <li>Supporting people with disabilities</li>
          <li>Cancellation options</li>
          <li>Our COVID-19 Response</li>
          <li>Report a neighborhood concern</li> */}
        </ul>
        <ul>
          <li><h1>LOGO</h1></li>
          <li><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, ab?</p></li>
        </ul>
      </div>

      <div className="Container">
        <div className="Footer-grid">
          <p className="Copy-right">
            © 2022
            <Link to="/booking"> nft-yacht </Link>, Inc. -
            <Link to="/booking"> Privacy </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
