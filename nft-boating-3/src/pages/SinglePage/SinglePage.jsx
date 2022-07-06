import { Link, useNavigate } from "react-router-dom";
import "./SinglePage.scss";
import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../ContextAPI";
import { useDispatch, useSelector } from "react-redux";
import { saveBookingID } from "../../features/BookingID/BookingIDSlice";

function SinglePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const init = useSelector((state) => state.base);

  const { account, active } = useWeb3React();
  const { ContractYacht } = useContextAPI();

  const [UserData, setUserData] = useState([]);
  const [User, setUser] = useState(true);

  const getUserData = async () => {
    setUserData([]);
    let userID = await ContractYacht.getUserIDs(account);

    if (userID.length === 0) {
      setUser(false);
    } else {
      for (let i = 0; i < userID.length; i++) {
        let tokenURI = await ContractYacht.tokenURI(userID[i].toString());
        console.log({ tokenURI });
        setUserData((prev) =>
          prev.concat({
            Token: userID[i].toString(),
            TokenURI: tokenURI,
            id: Date.now(),
          })
        );
      }
    }
  };

  useEffect(() => {
    if (!active) {
      return;
    } else {
      getUserData();
    }
  }, [account]);

  const bookDate = (data) => {
    dispatch(saveBookingID(data));
    navigate("/booking");
  };

  return (
    <div className="SinglePage">
      <div className="Container">
        <div className="Grid">
          <div>
            <img
              src={`https://gateway.pinata.cloud/ipfs/QmVvFRRb6HxtJ9832HbZ4sfuMvvTwrSnihdkwVe1VvrDRf`}
              alt=""
            />
          </div>
          <div className="Token-Details">
            <div className="Token-options">
              <h1>
                Lorem ipsum dolor #<span>1</span>
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipiscing elit egestas
                tempus quam, neque facilisis pulvinar gravida pretium cubilia
                cursus at.
              </p>
              <button className="bookDate" onClick={() => bookDate(1)}>
                Book Date
              </button>
            </div>

            <div className="Offers-Section">
              <div className="Offers-Title">
                <span>Offers</span>
              </div>
              <div className="Offers-detail">
                <ul className="Offers-list">
                  <li>
                    <span>0x0000000000</span>
                    <span>
                      USDT <span>300</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
