import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { saveNFTData } from "../../../features/BuyNFT/BuySlice";
import "./Form.scss";

export const Form = ({ setInit }) => {
  const dispatch = useDispatch();
  const base = useSelector((state) => state.base);
  // const { register, handleSubmit } = useForm({ defaultValues: { base } });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    dispatch(saveNFTData(data));
    setInit(1);
  };
  console.log({ errors });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="buyNftForm">
      <h6>Personal Information</h6>
      <div className="fullName">
        <input
          type="text"
          placeholder="First name"
          {...register("firstName", { required: true, maxLength: 80 })}
        />
        <input
          type="text"
          placeholder="Last name"
          {...register("lastName", { required: true, maxLength: 100 })}
        />
      </div>
      <input
        type="tel"
        placeholder="Mobile number"
        {...register("mobileNumber", {
          required: true,
          minLength: 6,
          maxLength: 12,
        })}
      />
      <input
        type="text"
        placeholder="Address Line 1"
        {...register("address1", { required: true, maxLength: 100 })}
      />
      <input
        type="text"
        placeholder="Address Line 2"
        {...register("address2", { required: true, maxLength: 100 })}
      />
      <div className="checkbox">
        <input
          type="checkbox"
          placeholder="Accept Terms and Conditions"
          {...register("Accept Terms and Conditions", { required: true })}
        />
        <p>Accept Terms and Conditions</p>
      </div>

      <div className="btn-submit">
        <input className="submit" type="submit" value="Next" />
      </div>
    </form>
  );
};
