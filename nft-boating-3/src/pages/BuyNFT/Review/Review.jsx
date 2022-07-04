import React from "react";
import { useSelector } from "react-redux";
import "./Review.scss";
import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../../ContextAPI";
import { auth, db } from "../../../DB/firebase-config";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";

export const Review = () => {
  const state = useSelector((state) => state);
  const { account, active } = useWeb3React();

  // smart contract calls
  const { Contract } = useContextAPI();

  const agency = async () => {
    let ab = await Contract.isOnSell(1);
    console.log(">>>", ab);
  };

  // fireBase calls
  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = React.useState();

  React.useEffect(() => {
    const databaseRef = collection(db, "users");
    getDocs(databaseRef)
      .then((res) => {
        res.docs.map((doc) => {
          if (doc.data().uid == user.uid) {
            setData({ ...doc.data(), id: doc.id });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log({ data });

  const addBuyNFT = async () => {
    const fieldToEdit = doc(db, "users", data.id);
    await updateDoc(fieldToEdit, { buyNFT: state.buyNFT })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="Review">
        <div className="card">
          <span className="cardNumber">
            <span>#</span>1
          </span>
          <div className="cardContainer">
            <h6>NFT Yacht</h6>
            <div className="cardDetails">
              <div className="box"></div>
              <div className="userDetails">
                <div>
                  <span className="userDetailsT">Address :</span>
                  <span>
                    {active
                      ? `${account.slice(0, 6)}...${account.slice(-4)}`
                      : "Not Connected"}
                  </span>
                </div>
                <div>
                  <span className="userDetailsT">Expiry Date :</span>
                  <span>07/02/2022</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <pre>{JSON.stringify(buyNFT, null, 2)}</pre> */}
        <button>back</button>
        <button onClick={addBuyNFT}>Transaction</button>
      </div>
    </>
  );
};
