import React from "react";
import { Form } from "./Form/Form";
import { Review } from "./Review/Review";
import { Mint } from "./Mint/Mint";
import "./BuyNFT.scss";
import { documentId } from "firebase/firestore";

function BuyNFT() {
  const [init, setInit] = React.useState(0);

//  if (init = 0) {
// <p> Formmm</p>
// } else {
//   <p>else</p>
//  }
  return (
    <div className="BuyNFT">
      <div className="Container BuyNFT-grid">
        <div>
          <div>
            <h1>Become a Member</h1>
            <div
              style={{
                margin: "auto auto 20px auto",
                display: "flex",
                maxWidth: "500px",
                justifyContent: "space-between",
              }}
            >
              {init == 0 ? (
                <>
                  <span
                    style={{ color: "#2d2dc2", borderBottom: "2px solid blue" }}
                  >
                    Personal Information
                  </span>
                </>
              ) : (
                <>
                  <span>Personal Information</span>
                </>
              )}
              {init == 1 ? (
                <>
                  <span
                    style={{ color: "#2d2dc2", borderBottom: "2px solid blue" }}
                  >
                    Mint
                  </span>
                </>
              ) : (
                <>
                  <span>Mint</span>
                </>
              )}
              {/* {init == 2 ? (
                <>
                  <span
                    style={{ color: "#2d2dc2", borderBottom: "2px solid blue" }}
                  >
                    Review Token
                  </span>
                </>
              ) : (
                <>
                  <span>Review Token</span>
                </>
              )} */}
              {/* <span>Form:</span><span>Mint:</span><span>Review</span> */}
              {/* <li>{init == 0 && <>Form</>}</li>
          <li>{init == 1 && <>Mint</>}</li>
          <li>{init == 2 && <>Review</>}</li> */}
            </div>
          </div>
          {init == 0 && <Form setInit={setInit} />}
          {init == 1 && <Mint setInit={setInit} />}
        </div>
        <div><Review setInit={setInit} /></div>
      </div>
    </div>
  );
};

export default BuyNFT;