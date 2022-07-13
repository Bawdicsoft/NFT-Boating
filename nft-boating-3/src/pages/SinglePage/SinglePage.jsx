import { Link, useNavigate, useParams } from "react-router-dom";
import "./SinglePage.scss";
import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../ContextAPI";
import { useDispatch, useSelector } from "react-redux";
import { saveBookingID } from "../../features/BookingID/BookingIDSlice";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { formatEther, parseEther, toString } from "ethers/lib/utils";


function SinglePage() {
  const { id } = useParams();
  console.log({ id });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const init = useSelector((state) => state);

  const { account, active } = useWeb3React();
  const { ContractYacht } = useContextAPI();

  //   mpdel

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function makeOffer() {
    setIsOpen(true);
  }

  const [UserIDs, setUserIDs] = useState([]);
  console.log(UserIDs.length);
  async function afterOpenModal() {
    console.log("run");
    const userIds = await ContractYacht.getUserIDs(account);
    setUserIDs(userIds);
    console.log(UserIDs.length );
  }

  function closeMakeOffer() {
    setIsOpen(false);
  }

  const [bookedDate, setBookedDate] = useState();
  const [BookingTrue, setBookingTrue] = useState(false);
  const [Offers, setOffers] = useState({});
  const [ownerOf, setOwnerOf] = useState();
  console.log(bookedDate);

  const getUserData = async () => {
    const [userDateDetails, getOffer, ownerOf] = await Promise.all([
      // ContractYacht.getBookedDate(init.BookingID.init),
      // ContractYacht.getOffer(init.BookingID.init),

      ContractYacht.getBookedDate(id),
      ContractYacht.getOffer(id),
      ContractYacht.ownerOf(id),
    ]);

    console.log({ userDateDetails, getOffer, ownerOf });

    setOwnerOf(ownerOf.toString());

    console.log(userDateDetails[1].toString());
    if (userDateDetails[1].toString() != 0) {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(userDateDetails[1].toString()).toLocaleString();
      setBookedDate(t.toString());
      setBookingTrue(true);
    }

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
  const sendOffer = async (data) => {
    console.log(data.TokenID);
    await ContractYacht.offer(
      // init.BookingID.init,
      id,
      data.TokenID,
      "300000000000000000000"
    );
  };
  console.log(errors);

  const AcceptOffer = async () => {
    // await ContractYacht.acceptOffer(init.BookingID.init);
    await ContractYacht.acceptOffer(id);
  };

  return (
    <div className="SinglePage">
      <div className="Container">
        <div className="Grid">
          <div>
            <img
              src={`https://cloudflare-ipfs.com/ipfs/Qmacuvgf1m4j35prXdbUJhmkycpYDk2Km9rZEhMv2Causz/${id}.png`}
              alt=""
            />
          </div>
          <div className="Token-Details">
            <div className="Token-options">
              {BookingTrue ? (
                <div className="bookedDate">
                  <p>Booked Date: </p>
                  <p className="date">{bookedDate.slice(0, 15)}</p>
                </div>
              ) : (
                ""
              )}
              <h1>
                {/* Lorem ipsum dolor #<span>{init.BookingID.init}</span> */}
                Lorem ipsum dolor #<span>{id}</span>
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipiscing elit egestas
                tempus quam, neque facilisis pulvinar gravida pretium cubilia
                cursus at.
              </p>
              <div className="buttons">
                <button
                  className="bookDate"
                  // onClick={() => bookDate(init.BookingID.init)}
                  onClick={() => navigate(`/booking/${id}`)}
                >
                  Book Date
                </button>
                {ownerOf && bookedDate ? (
                  <>
                    {ownerOf != account ? (
                      <button className="bookDate" onClick={makeOffer}>
                        Make Offer
                      </button>
                    ) : (
                      ""
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>

            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeMakeOffer}
              contentLabel="Example Modal"
              className="Modal"
              overlayClassName="Overlay"
            >
              <button className="x-button" onClick={closeMakeOffer}>
                X
              </button>

              {UserIDs.length ? (
                <>
                  {BookingTrue ? (
                    <div className="title-modal">
                      Make Offer for: {bookedDate.slice(0, 15)}
                    </div>
                  ) : (
                    ""
                  )}
                  <form
                    className="Modal-form-offer"
                    onSubmit={handleSubmit(sendOffer)}
                  >
                    <p>Select your token id</p>
                    <select {...register("TokenID", { required: true })}>
                      {UserIDs.map((userID) => (
                        <option
                          key={userID.toString()}
                          value={userID.toString()}
                        >
                          {userID.toString()}
                        </option>
                      ))}
                    </select>

                    <div className="btn-submit">
                      <input className="submit" type="submit" />
                    </div>
                  </form>
                </>
              ) : (
                <div className="BuyNFT-link-container">
                  <p className="BuyNFT-link-p">
                    you didn't have any NFT for the booking.
                  </p>
                  <Link className="BuyNFT-link" to="/BuyNFT">
                    Buy Your NFTs
                  </Link>
                </div>
              )}
            </Modal>

            {Offers.Price ? (
              <div className="Offers-Section">
                <div className="Offers-Title">
                  <span>Offers</span>
                </div>
                <div className="Offers-detail">
                  <ul className="Offers-list">
                    <li>
                      <span>{Offers.User.slice(0, 6)}</span>
                      <span>
                        USDT <span>{formatEther(Offers.Price)}</span>
                      </span>
                      <button onClick={AcceptOffer}>Accept</button>
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
