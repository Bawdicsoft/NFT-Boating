import React from "react";
import { Form } from "./Form/Form";
import { Review } from "./Review/Review";
import "./BuyNFT.scss";

function BuyNFT() {
  const [state, setState] = React.useState(false);

  return (
    <div className="BuyNFT">
      <div className="Container">
        <div>
          <h1>BuyNFT</h1>
        </div>
        {state ? <Form setState={setState} /> : <Review />}
      </div>
    </div>
  );
};

export default BuyNFT;