import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./BookedDates.scss";

import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../../ContextAPI";
import { formatEther, parseEther, toString } from "ethers/lib/utils";

import Dashboard from "./../Dashboard";

function BookedDates() {
  const { account, active } = useWeb3React();
  const { ContractYacht } = useContextAPI();

  const [UserBookedDates, setUserBookedDates] = useState([]);
  console.log("UserBookedDates", UserBookedDates);

  const getUserBookedDates = async () => {
    setUserBookedDates([]);
    let UserIDs = await ContractYacht.getUserIDs(account);

    for (let i = 0; i < UserIDs.length; i++) {
      let BookedDate = await ContractYacht.getBookedDate(UserIDs[i].toString());

      if (BookedDate._blockTimestamp.toString() != 0) {
        const t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(BookedDate._blockTimestamp.toString()).toLocaleString();
        const BookingDate = t.toString();
        t.setSeconds(BookedDate._DateAndTime.toString()).toLocaleString();
        const BookDate = t.toString();
        t.setSeconds(BookedDate._newYear.toString()).toLocaleString();
        const ReBookingDate = t.toString();

        setUserBookedDates((prev) =>
          prev.concat({
            BookingDate,
            BookDate,
            ReBookingDate,
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
      getUserBookedDates();
    }
  }, [account]);

  const handelCancel = async (OfferTokenID) => {
    console.log({ OfferTokenID });
    await ContractYacht.cancelBooking(OfferTokenID)
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log(err.data.massage);
      });
  };

  return (
    <>
      <Dashboard />
      <div className="BookedDates">
        <div className="Container">
          <h2>Booked Dates</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit auctor,
            cursus nascetur odio nam gravida vehicula lacus
          </p>

          <div className="table-offer">
            {UserBookedDates.length ? (
              <table>
                <thead>
                  <tr>
                    <th>Booking Date</th>
                    <th>Book Date</th>
                    <th>Button</th>
                  </tr>
                </thead>

                <tbody>
                  {UserBookedDates.map((date) => (
                    <tr key={date.id}>
                      <td>{date.BookingDate}</td>
                      <td>{date.BookDate}</td>
                      <td>
                        <button onClick={() => handelCancel(date.id)}>
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

export default BookedDates;
