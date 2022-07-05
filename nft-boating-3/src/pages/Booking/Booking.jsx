import React from "react";
import { Form } from "./Form/Form";
import { Review } from "./Review/Review";
import "./Booking.scss";

function BuyNFT() {
  const [state, setState] = React.useState(0);

  console.log(">>>>>>>>", state);

  return (
    <div className="BuyNFT">
      <div className="Container">
        <div>
          <h1>Booking</h1>
        </div>

        {state == 0 && <Form setState={setState} />}
        {state == 1 && <Review setState={setState} />}

      </div>
    </div>
  );
};

export default BuyNFT;