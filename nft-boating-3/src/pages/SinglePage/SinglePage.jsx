import { Link, useNavigate } from "react-router-dom";
import "./SinglePage.scss";
import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../ContextAPI";
import { useDispatch, useSelector } from "react-redux";
import { saveBookingID } from "../../features/BookingID/BookingIDSlice";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  form: {
    border: "1px solid black",
  },
};

Modal.setAppElement("#root");

function SinglePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const init = useSelector((state) => state);

  const { account, active } = useWeb3React();
  const { ContractYacht } = useContextAPI();

  //   mpdel

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function makeOffer() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }

  function closeMakeOffer() {
    setIsOpen(false);
  }

  const [bookedDate, setBookedDate] = useState("00 0000 00:00:00");
  const [Offers, setOffers] = useState({});
  console.log(bookedDate);

  const getUserData = async () => {
    // let userDateDetails = await ContractYacht.getBookedDate(1);
    const [userDateDetails, getOffer] = await Promise.all([
      ContractYacht.getBookedDate(1),
      ContractYacht.getOffer(1),
    ]);

    console.log(userDateDetails[1].toString());
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(userDateDetails[1].toString()).toLocaleString();
    setBookedDate(t.toString());

    if (getOffer._time.toString() > 0) {
      const Offer = {
        User: getOffer._user.toString(),
        Price: getOffer._price.toString(),
        Time: getOffer._time.toString(),
      };
      setOffers(Offer);
      console.log({ Offer });
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

  // offer function on onSubmit
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  console.log(errors);

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
              <div className="bookedDate">
                <p>Booked Date: </p>
                <p className="date">{bookedDate.slice(0, 15)}</p>
              </div>
              <h1>
                Lorem ipsum dolor #<span>{init.BookingID.init}</span>
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipiscing elit egestas
                tempus quam, neque facilisis pulvinar gravida pretium cubilia
                cursus at.
              </p>
              <div className="buttons">
                <button
                  className="bookDate"
                  onClick={() => bookDate(init.BookingID.init)}
                >
                  Book Date
                </button>
                <button className="bookDate" onClick={makeOffer}>
                  Make Offer
                </button>
              </div>
            </div>

            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeMakeOffer}
              //   style={customStyles}
              contentLabel="Example Modal"
              className="Modal"
              overlayClassName="Overlay"
            >
              <button className="x-button" onClick={closeMakeOffer}>
                X
              </button>
              <div className="title-modal">
                Make Offer for: {bookedDate.slice(0, 15)}
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <select
                  {...register("Select your Token ID", { required: true })}
                >
                  <option value="1">1</option>
                  <option value=" 2">2</option>
                  <option value=" 3">3</option>
                </select>

                <input type="submit" />
              </form>
            </Modal>

            {Offers.Price ? (
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
                      <span>Accept</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
