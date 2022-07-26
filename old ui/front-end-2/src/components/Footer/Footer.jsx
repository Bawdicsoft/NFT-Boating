import { Link } from "react-router-dom";
import "./Footer.scss";
import { ReactComponent as Facebook } from "../../Assets/Icon/Facebook.svg";
import React from "react";

function Footer() {
  return (
    <div className="Footer">
      <div className="Container useful-links">
        <ul>
          <li>Support</li>
          <li>Help Center</li>
          <li>AirCover</li>
          <li>Safety information</li>
          <li>Supporting people with disabilities</li>
          <li>Cancellation options</li>
          <li>Our COVID-19 Response</li>
          <li>Report a neighborhood concern</li>
        </ul>
        <ul>
          <li>Support</li>
          <li>Help Center</li>
          <li>AirCover</li>
          <li>Safety information</li>
          <li>Supporting people with disabilities</li>
          <li>Cancellation options</li>
          <li>Our COVID-19 Response</li>
          <li>Report a neighborhood concern</li>
        </ul>
        <ul>
          <li>Support</li>
          <li>Help Center</li>
          <li>AirCover</li>
          <li>Safety information</li>
          <li>Supporting people with disabilities</li>
          <li>Cancellation options</li>
          <li>Our COVID-19 Response</li>
          <li>Report a neighborhood concern</li>
        </ul>
      </div>

      <div className="Container">
        <div className="Footer-grid">
          <p className="Copy-right">
            © 2022
            <Link to="/booking"> Airbnb </Link>, Inc. -
            <Link to="/booking"> Privacy </Link>
          </p>
          <ul>
            <li>
              <Facebook />
            </li>
            <li>
              <Facebook />
            </li>
            <li>
              <Facebook />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
