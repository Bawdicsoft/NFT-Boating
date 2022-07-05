import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../ContextAPI";
import { useDispatch, useSelector } from "react-redux";
import { saveBookingID } from "../../features/BookingID/BookingIDSlice";



function Dashboard() {
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
    // /booking
    // <Navigate  to="/booking" />;
    navigate("/booking");
  };

  return (
    <div className="Dashboard">
      <div className="cards">
        <div className="Container">
          <h2>Your NFTs</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit auctor,
            cursus nascetur odio nam gravida vehicula lacus
          </p>

          <div className="Grid">
            {User ? (
              <>
                {UserData.map((User) => (
                  <div key={User.id} onClick={() => bookDate(User.Token)}>
                    {/* <div className="Box">{User.TokenURI}</div> */}
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/QmVvFRRb6HxtJ9832HbZ4sfuMvvTwrSnihdkwVe1VvrDRf`}
                      alt=""
                    />
                    <div className="cardDetails">
                      <h5>{`${account.slice(0, 5)}...${account.slice(-5)}`}</h5>
                      <p>{User.Token}</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div></div>
                <Link className="BuyNFT" to="/BuyNFT">
                  Buy Your NFTs
                </Link>
                <div></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
