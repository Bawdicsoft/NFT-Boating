import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OffersReceived.scss";

import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../../ContextAPI";
import { formatEther, parseEther, toString } from "ethers/lib/utils";

import Dashboard from "./../Dashboard";

function OffersReceived() {
  const { account, active } = useWeb3React();
  const { ContractYacht } = useContextAPI();

  const [UserOfferedIDs, setUserOfferedIDs] = useState([]);
  console.log("UserOfferedIDs", UserOfferedIDs);

  const getUserOfferedIDs = async () => {
    setUserOfferedIDs([]);
    let UserIDs = await ContractYacht.getUserIDs(account);

    for (let i = 0; i < UserIDs.length; i++) {
      let OfferData = await ContractYacht.getOffer(UserIDs[i].toString());
      // console.log("OfferData", OfferData);

      if (OfferData._time.toString() != 0) {
        setUserOfferedIDs((prev) =>
          prev.concat({
            user: OfferData._user.toString(),
            price: formatEther(OfferData._price.toString()),
            time: OfferData._time.toString(),
            userID: OfferData._userID.toString(),
            id: UserIDs[i].toString(),
          })
        );
      }
    }
  };

  useEffect(() => {
    if (!active) {
      return;
    } else {
      getUserOfferedIDs();
    }
  }, [account]);

  const handelAccept = async (OfferTokenID) => {
    console.log({ OfferTokenID });
    await ContractYacht.acceptOffer(OfferTokenID)
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log(err.reason || err.massage);
      });
  };

  return (
    <>
      <Dashboard />
      <div className="OffersReceived">
        <div className="Container">
          <h2>Received Offers</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit auctor,
            cursus nascetur odio nam gravida vehicula lacus
          </p>

          <div className="table-offer">
            {UserOfferedIDs.length ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Button</th>
                  </tr>
                </thead>

                <tbody>
                  {UserOfferedIDs.map((offer) => (
                    <tr key={offer.id}>
                      <td>
                        <Link to={`/single-page/${offer.id}`}>#{offer.id}</Link>
                      </td>
                      <td>
                        {`${offer.user.slice(0, 6)}...${offer.user.slice(-5)}`}
                      </td>
                      <td>USDT {offer.price}</td>
                      <td>
                        <button onClick={() => handelAccept(offer.id)}>
                          Accept
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No offers yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OffersReceived;
