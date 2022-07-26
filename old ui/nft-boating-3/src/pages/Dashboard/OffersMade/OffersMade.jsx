import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OffersMade.scss";

import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../../ContextAPI";
import { formatEther, parseEther, toString } from "ethers/lib/utils";
import { async } from "@firebase/util";

import Dashboard from "./../Dashboard";


function OffersMade() {
  const { account, active } = useWeb3React();
  const { ContractYacht } = useContextAPI();

  const [userOffers, setUserOffers] = useState([]);
  console.log("userOffers", userOffers);

  const getUserAllOffers = async () => {
    setUserOffers([]);
    let UserAllOffersIDs = await ContractYacht.getUserAllOffers(account);

    for (let i = 0; i < UserAllOffersIDs.length; i++) {
      let OfferData = await ContractYacht.getOffer(
        UserAllOffersIDs[i].toString()
      );

      setUserOffers((prev) =>
        prev.concat({
          user: OfferData._user.toString(),
          price: formatEther(OfferData._price.toString()),
          time: OfferData._time.toString(),
          userID: OfferData._userID.toString(),
          id: UserAllOffersIDs[i].toString(),
        })
      );
    }
  };

  useEffect(() => {
    if (!active) {
      return;
    } else {
      getUserAllOffers();
    }
  }, [account]);

  const handelCancel = async (OfferTokenID) => {
    console.log({ OfferTokenID });
    await ContractYacht.cancelOffer(OfferTokenID)
        .then((res) => {
            console.log({ res });
            getUserAllOffers();
        }).catch((err) => {
            console.log(err.reason || err.massage)
        });
  }

  return (
    <>
      <Dashboard />
      <div className="OffersMade">
        <div className="Container">
          <h2>Offers Made</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit auctor,
            cursus nascetur odio nam gravida vehicula lacus
          </p>

          <div className="table-offer">
            {userOffers.length ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Price</th>
                    <th>Button</th>
                  </tr>
                </thead>

                <tbody>
                  {userOffers.map((offer) => (
                    <tr key={offer.id}>
                      <td>
                        <Link to={`/single-page/${offer.id}`}>#{offer.id}</Link>
                      </td>
                      <td>USDT {offer.price}</td>
                      <td>
                        <button onClick={() => handelCancel(offer.id)}>
                          Cancel
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

export default OffersMade;
