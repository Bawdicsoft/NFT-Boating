import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { saveBooking } from "../../../features/Booking/BookingSlice";
import "./Form.scss";
import { useContextAPI } from "../../../ContextAPI";

export const Form = ({ setState }) => {
  const dispatch = useDispatch();
  const base = useSelector((state) => state);
  const { ContractYacht } = useContextAPI();

  console.log("buy form nft number", base.BookingID.init);

  // const { register, handleSubmit } = useForm({ defaultValues: { base } });
  const [dateError, setDateError] = useState("");
  console.log({ dateError });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const onSubmit = data => console.log(data);
  const onSubmit = async (data) => {
    console.log(data);
    await ContractYacht.bookDate(
      data.TimeAndDate.slice(0, 4),
      data.TimeAndDate.slice(5, 7),
      data.TimeAndDate.slice(8, 10),
      base.BookingID.init
    )
      .then(() => {
        dispatch(saveBooking(data));
        // setState(1);
      })
      .catch((e) => {
        console.log(e.reason);
        if (e.reason === "execution reverted: Already Booked") {
          setDateError("Already Booked");
        }
      });
  };
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="buyNftForm">
      <input
        type="date"
        placeholder="Chose Time AND Date"
        {...register("TimeAndDate", { required: true })}
      />
      {dateError ? <p>{dateError}</p> : ""}
      <input
        type="tel"
        placeholder="Mobile number"
        {...register("Mobile number", {
          required: true,
          minLength: 6,
          maxLength: 12,
        })}
      />
      <input
        type="number"
        placeholder="How many person will you be with?"
        {...register("How many person will you be with?", {
          required: true,
          max: 12,
          min: 3,
        })}
      />
      <textarea
        placeholder="Notes (optional)"
        {...register("Notes (optional)", {})}
      />

      <input type="submit" />
    </form>
  );
};
