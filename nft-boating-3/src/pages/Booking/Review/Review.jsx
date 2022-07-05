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

export const Review = ({ setState }) => {
  const state = useSelector((state) => state);
  const { account, active } = useWeb3React();

  // smart contract calls
  const { ContractYacht } = useContextAPI();

  const agency = async () => {
    let ab = await ContractYacht.isOnSell(1);
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
    await ContractYacht.bookDate(
      3,
      ["google.com", ".google.com", ".google.com"],
      "3000000000000000000"
    );
    const fieldToEdit = doc(db, "users", data.id);
    await updateDoc(fieldToEdit, { buyNFT: state.buyNFT })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const backBtn = () => {
    setState(0);
  };

  // const createTokenFunc = async () => {
  //   html2canvas(document.getElementById("html-content-holder")).then(
  //     async (canvas) => {

  //       const URLforpinJSONtoIPFS = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  //       axios
  //         .post(
  //           URLforpinJSONtoIPFS,
  //           {
  //             name: item._fullName,
  //             description: item._details,
  //             image: canvas.toDataURL(),
  //             attributes: [
  //               {
  //                 trait_type: "trait",
  //                 value: 100,
  //               },
  //             ],
  //           },
  //           {
  //             headers: {
  //               pinata_api_key: API_KEY,
  //               pinata_secret_api_key: API_SECRET,
  //             },
  //           }
  //         )
  //         .then(async function (response) {

  //           const urlForTicketToken = `ipfs://${response.data.IpfsHash}`;

  //           const tx1 = await RealEstateContract.createTicket(
  //             item.id,
  //             urlForTicketToken
  //           );
  //           await tx1.wait();

  //           const checPropertyTokenContract =
  //             await PropertyTokenContract.isApprovedOrOwner(
  //               RealEstateContractAddress,
  //               item.id
  //             );

  //           const checkTicketTokenContract =
  //             await TicketTokenContract.isApprovedOrOwner(
  //               RealEstateContractAddress,
  //               item.id
  //             );

  //           if (!checPropertyTokenContract) {
  //             const tx2 = await PropertyTokenContract.approve(
  //               RealEstateContractAddress,
  //               item.id
  //             );
  //             await tx2.wait();
  //           }

  //           if (!checkTicketTokenContract) {
  //             const tx3 = await TicketTokenContract.approve(
  //               RealEstateContractAddress,
  //               item.id
  //             );
  //             await tx3.wait();
  //           }

  //           window.location.reload();
  //         })
  //         .catch(function (error) {
  //           //handle error here
  //           console.log(error);
  //         });
  //     }
  //   );
  // };

  return (
    <>
      <div className="Review">
        {/* <!-- If you would like to customize the button, remove or change the "class" attribute inside the <span> tag --> */}

        <span
          className="glf-button"
          data-glf-cuid="739b880c-65b0-46a4-b6e0-43809945bc2f"
          data-glf-ruid="b9cfb6da-c1c2-4ccc-9868-cec5ab7f194f"
        >
          See MENU & Order
        </span>

        <span
          className="glf-button reservation"
          data-glf-cuid="739b880c-65b0-46a4-b6e0-43809945bc2f"
          data-glf-ruid="b9cfb6da-c1c2-4ccc-9868-cec5ab7f194f"
          data-glf-reservation="true"
        >
          Table Reservation
        </span>

        <div className="btn">
          <button className="btn-back" onClick={backBtn}>
            back
          </button>
          <button className="Transaction" onClick={addBuyNFT}>
            Transaction
          </button>
        </div>
      </div>
    </>
  );
};
