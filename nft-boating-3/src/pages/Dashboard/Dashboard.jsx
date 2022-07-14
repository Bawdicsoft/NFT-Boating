import "./Dashboard.scss";
import React, { useState, useEffect } from "react";

import OffersMade from "./OffersMade/OffersMade";
import OffersReceived from "./OffersReceived/OffersReceived";
import BookedDates from "./BookedDates/BookedDates";
import OwnerShips from "./OwnerShips/OwnerShips";

function Dashboard() {
  const [DBMenu, setDBMenu] = useState("OwnerShips");

  return (
    <div className="Dashboard">
      <div className="Container second-menu">
        <ul>
          <li onClick={() => setDBMenu("OwnerShips")}>OwnerShips</li>
          <li onClick={() => setDBMenu("BookedDates")}>BookedDates</li>
          <li onClick={() => setDBMenu("OffersMade")}>Offers Made</li>
          <li onClick={() => setDBMenu("OffersReceived")}>Offers Received</li>
        </ul>
      </div>

      {(() => {
        switch (DBMenu) {
          case "OwnerShips":
            return <OwnerShips />;

          case "BookedDates":
            return <BookedDates />;

          case "OffersMade":
            return <OffersMade />;

          case "OffersReceived":
            return <OffersReceived />;
        }
      })()}
    </div>
  );
}

export default Dashboard;
