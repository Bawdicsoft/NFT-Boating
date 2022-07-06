import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { saveNFT } from "../../../features/BuyNFT/BuySlice";
import { useContextAPI } from "../../../ContextAPI";
import { useWeb3React } from "@web3-react/core";
import "./Mint.scss";
import { formatEther } from "ethers/lib/utils";
import { async } from "@firebase/util";

export const Mint = ({ setInit }) => {
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

  const onSubmit = (data) => {
    dispatch(saveNFT(data.totalMint));
    setInit(2);
  };

  const handleApprove = async () => {
    const balanceOf = await ContractUSDT.balanceOf(account);
    const approve = await ContractUSDT.approve(NFTYacht, balanceOf);
    getDataFromSmartContract();
  }

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
        {Allowance < totalMint * GetRate && (
          <button className="approve" onClick={handleApprove}>
            Approve
          </button>
        )}
        {Allowance >= totalMint * GetRate && (
          <input className="submit" type="submit" value="Next" />
        )}
      </div>
    </form>
  );
};
