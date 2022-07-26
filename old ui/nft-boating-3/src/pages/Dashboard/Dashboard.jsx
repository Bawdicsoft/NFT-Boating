import "./Dashboard.scss";
import React from "react";
import { Link } from "react-router-dom";



function Dashboard() {
  return (
    <div className="Dashboard">
      <div className="Container second-menu">
        <ul>
          <li>
            <Link to="/owner-ships">Owner Ships</Link>
          </li>
          <li>
            <Link to="/booked-Dates">Booked Dates</Link>
          </li>
          <li>
            <Link to="/offers-made">Offers Made</Link>
          </li>
          <li>
            <Link to="/offers-received">Offers Received</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
