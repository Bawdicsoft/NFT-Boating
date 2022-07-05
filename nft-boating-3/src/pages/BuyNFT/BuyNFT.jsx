import React from "react";
import { Form } from "./Form/Form";
import { Review } from "./Review/Review";
import { Mint } from "./Mint/Mint";
import "./BuyNFT.scss";

function BuyNFT() {
  const [init, setInit] = React.useState(0);

  return (
    <div className="BuyNFT">
      <div className="Container">
        <div>
          <h1>BuyNFT</h1>
        </div>
        {init == 0 && <Form setInit={setInit} />}
        {init == 1 && <Mint setInit={setInit} />}
        {init == 2 && <Review setInit={setInit} />}
      </div>
    </div>
  );
};

export default BuyNFT;