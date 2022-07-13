import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { saveNFT } from "../../../features/BuyNFT/BuySlice";
import { useContextAPI } from "../../../ContextAPI";
import { useWeb3React } from "@web3-react/core";
import { auth, db } from "../../../DB/firebase-config";
import "./Mint.scss";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { formatEther, parseEther, toString } from "ethers/lib/utils";
import { async } from "@firebase/util";
import { useAuthState } from "react-firebase-hooks/auth";

export const Mint = ({ setInit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const base = useSelector((state) => state.base);
  const { account, active } = useWeb3React();
  const { ContractYacht, ContractUSDT, NFTYacht } = useContextAPI();

  const [GetRate, setGetRate] = useState();
  const [Allowance, setAllowance] = useState();

  const getDataFromSmartContract = async () => {
    let getRate = await ContractYacht.getRate();
    setGetRate(formatEther(getRate));

    const allowance = await ContractUSDT.allowance(account, NFTYacht);
    setAllowance(formatEther(allowance));
  };

  const Approved = () => {
    ContractUSDT.on("Approval", async (owner, spender, amount) => {
      const allowance = await ContractUSDT.allowance(account, NFTYacht);
      setAllowance(formatEther(allowance));
    });
  };

  useEffect(() => {
    getDataFromSmartContract();
  }, [account]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      totalMint: 1,
    },
  });
  console.log({ errors });

  const totalMint = watch("totalMint");

  const [user, loading, error] = useAuthState(auth);
  const [UserData, setUserData] = useState();

  useEffect(() => {
    const databaseRef = collection(db, "users");
    getDocs(databaseRef)
      .then((res) => {
        res.docs.map((doc) => {
          if (doc.data().uid == user.uid) {
            setUserData({ ...doc.data(), id: doc.id });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit = async (formData) => {
    // dispatch(saveNFT(formData.totalMint));

    // smart Contract call
    let getRate = await ContractYacht.getRate();
    getRate = formatEther(getRate);
    getRate = getRate * formData.totalMint;
    getRate = parseEther(getRate.toString());
    await ContractYacht.buyOwnership(formData.totalMint, getRate.toString());

    // firebase call
    console.log("db", db);
    console.log("UserData", formData.totalMint);
    
    const fieldToEdit = doc(db, "users", UserData.id);
    const buyNFT = `buyNFT ${new Date()}`;
    console.log("buyNFT", buyNFT);
    
    const totalMintToken = { totalMint: formData.totalMint };
    console.log("totalMintToken", totalMintToken);

    await updateDoc(fieldToEdit, { [buyNFT]: totalMintToken })
      .then((res) => {
        console.log(res);
        navigate(`/dashboard`);
      })
      .catch((err) => console.log(err));
  };

  const handleApprove = async () => {
    const balanceOf = await ContractUSDT.balanceOf(account);
    const approve = await ContractUSDT.approve(NFTYacht, balanceOf)
      .then((e) => {
        Approved();
        console.log(e.hash);
      })
      .catch((e) => {
        console.log(e.reason);
      });
  };

  const backFun = () => {
    setInit(0);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="Mint">
      <h6>Mint</h6>
      <div className="userAddress">
        <p>Wallet Address :</p>
        <p>{active ? account : "Connect MetaMask"}</p>
      </div>
      <div className="contractInfo">
        <div>
          <p>Supply</p>
          <p>00/00</p>
        </div>
        <div>
          <p>Sale status</p>
          <p>Close</p>
        </div>
      </div>
      <div>
        <p>
          Total Price: <span>{GetRate ? GetRate : 0.0}</span>
        </p>
        <p className="ethPrice">
          ETH : <span>{GetRate ? totalMint * GetRate : 0.0}</span>
        </p>
      </div>
      <input
        type="number"
        placeholder="Total Mint"
        min={1}
        max={10}
        {...register("totalMint", { required: true, max: 10, min: 0 })}
      />
      <div className="btn-submit">
        <button className="backBtn" onClick={backFun}>
          Back
        </button>

        {Allowance ? (
          <>
            {Allowance >= totalMint * GetRate && (
              <input className="submit" type="submit" value="Transaction" />
            )}

            {Allowance < totalMint * GetRate && (
              <p className="approve" onClick={handleApprove}>
                Approve
              </p>
            )}
          </>
        ) : (
          <p className="approve">loading...</p>
        )}
      </div>
    </form>
  );
};
