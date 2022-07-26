import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./Review.scss";
import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../../ContextAPI";
import { auth, db } from "../../../DB/firebase-config";
// import html2canvas from "html2canvas";
import QRCode from "react-qr-code";
import { formatEther, parseEther, toString } from "ethers/lib/utils";
// import axios from "axios";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import img from "./../../../Assets/token/0.png"
export const Review = ({ setInit }) => {
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const { account, active } = useWeb3React();

  // smart contract calls
  const { ContractYacht } = useContextAPI();

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

  const [pinataHash, setPinataHash] = React.useState([]);

  const Transaction = async () => {
    // html2canvas(document.querySelector(".card")).then(async (canvas) => {
    //   const API_KEY = "8d31bd2459d2316d1247";
    //   const API_SECRET =
    //     "de85fddf4b2b1e799ec8b9ff111514e449029d7f38d14569de3bb1385f8e1308";
    //   console.log(canvas);
    //   const URLforpinJSONtoIPFS = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //   console.log(canvas.toDataURL());
    //   axios
    //     .post(
    //       URLforpinJSONtoIPFS,
    //       {
    //         name: `NFT Yacht`,
    //         description: `Lorem ipsum dolor sit amet consectetur adipiscing elit nascetur, fames et euismod mi aliquam arcu libero litora urna, dui ornare justo scelerisque etiam placerat ligula. Blandit duis tempor vulputate lobortis cras faucibus habitasse sollicitudin ornare platea ullamcorper, integer est fusce libero phasellus curabitur morbi arcu praesent. Fames imperdiet class litora ligula pulvinar orci ut, tempor aenean eget dui quisque rhoncus, aliquet nunc sollicitudin tristique interdum consequat.`,
    //         image: canvas.toDataURL(),
    //       },
    //       {
    //         headers: {
    //           pinata_api_key: API_KEY,
    //           pinata_secret_api_key: API_SECRET,
    //         },
    //       }
    //     )
    //     .then(async function (response) {
    //       const urlForTicketToken = `ipfs://${response.data.IpfsHash}`;
    //       console.log(response);
    //       // const tx1 = await RealEstateContract.createTicket(
    //       //   item.id,
    //       //   urlForTicketToken
    //       // );
    //       // await tx1.wait();
    //       // const checkTicketTokenContract =
    //       //   await TicketTokenContract.isApprovedOrOwner(
    //       //     RealEstateContractAddress,
    //       //     item.id
    //       //   );
    //       // if (!checkTicketTokenContract) {
    //       //   const tx3 = await TicketTokenContract.approve(
    //       //     RealEstateContractAddress,
    //       //     item.id
    //       //   );
    //       //   await tx3.wait();
    //       // }
    //     })
    //     .catch(function (error) {
    //       //handle error here
    //       console.log(error);
    //     });
    // });
    // // smart Contract call
    // let getRate = await ContractYacht.getRate();
    // getRate = formatEther(getRate);
    // getRate = getRate * state.buyNFT.nft;
    // getRate = parseEther(getRate.toString());
    // await ContractYacht.buyOwnership(state.buyNFT.nft, getRate.toString());
    // // firebase call
    // const fieldToEdit = doc(db, "users", data.id);
    // await updateDoc(fieldToEdit, { buyNFT: state.buyNFT.init })
    //   .then((res) => {
    //     console.log(res);
    //     navigate(`/dashboard`);
    //   })
    //   .catch((err) => console.log(err));
  };

  const backFun = () => {
    setInit(1);
  };

  return (
    <>
      <div className="Review">
        <img src={img} alt="" />

        {/* <div className="card">
          <span className="cardNumber">
            <span>#</span>
            {state.buyNFT.nft}
          </span>
          <div className="cardContainer">
            <h6>NFT Yacht</h6>
            <div className="cardDetails">
              <div className="box">
                <QRCode
                  value={
                    "https://rinkeby.etherscan.io/address/0x0516685D6FB14dcb0A8fbacF7029E98f63BcC20a"
                  }
                  size={100}
                />
              </div>
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
        </div> */}

        {/* <div className="userFormDetails">
          <span>Name :</span>
          <span>
            {state.buyNFT.init.firstName} {state.buyNFT.init.lastName}
          </span>
          <span>Total NFT :</span>
          <span>{state.buyNFT.nft}</span>
        </div> */}

        {/* <div className="btn">
          <button className="btn-back" onClick={backFun}>
            back
          </button>
          <button className="Transaction" onClick={Transaction}>
            Transaction
          </button>
        </div> */}
      </div>
    </>
  );
};
