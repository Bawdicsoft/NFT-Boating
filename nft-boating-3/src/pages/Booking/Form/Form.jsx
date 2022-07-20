import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { saveBooking } from "../../../features/Booking/BookingSlice";
import "./Form.scss";
import { useContextAPI } from "../../../ContextAPI";
import FoodMenu from "./../FoodMenu/FoodMenu";
import { useWeb3React } from "@web3-react/core";
import Modal from "react-modal";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../DB/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css";
import DatePicker, {
  utils,
} from "@amir04lm26/react-modern-calendar-date-picker";

export const Form = ({ setState }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const base = useSelector((state) => state);
  // console.log("base", base.user.init[0].id);
  const { ContractYacht } = useContextAPI();
  const { account, active } = useWeb3React();

  /***
   * date time
   */
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [days, setDays] = useState(
    new Date().setDate(new Date().getDate() + 20)
  );
  var availDate = new Date(days);
  var daysAdded = availDate.toISOString().split("T")[0];

  const currentDate = new Date().setDate(new Date().getDate() + 20);

  const maximumDate = {
    year: daysAdded.slice(0, 4),
    month: daysAdded.slice(5, 7),
    day: daysAdded.slice(8, 10),
  };

  const minimumDate = {
    year: date.slice(0, 4),
    month: date.slice(5, 7),
    day: date.slice(8, 10),
  };

  const [selectedDay, setSelectedDay] = useState(null);

  const [dateError, setDateError] = useState();
  const [getBookDateID, setGetBookDateID] = useState();

  const handleDisabledSelect = async (disabledDay) => {

    for (let i = 0; i < disabledDays.length; i++) {
      if (disabledDays[i].day === disabledDay.day) {
        await ContractYacht.getBookDateID(
          disabledDay.year,
          disabledDay.month,
          disabledDay.day
        ).then((res) => {
          setGetBookDateID(res.toString());
          setDateError(disabledDay);
        });
      }
    }
  };

  const [disabledDays, setDisabledDays] = useState([]);
  async function afterOpenModal() {
    setDisabledDays([]);

    let newYear = await ContractYacht.newYear();
    let allBookedDates = await ContractYacht.getAllBookedDates(
      newYear.toString()
    );

    if (Number(newYear.toString())) {
      for (let i = 0; i < allBookedDates.length; i++) {
        setDisabledDays((prev) =>
          prev.concat({
            year: Number(allBookedDates[i]._year.toString()),
            month: Number(allBookedDates[i]._month.toString()),
            day: Number(allBookedDates[i]._day.toString()),
          })
        );
      }
    }
  }

  useEffect(() => {
    if (!active) {
      return;
    } else {
      afterOpenModal();
    }
  }, [account]);

  /******************************
   * date time end
   *********************************/

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [user, loading, error] = useAuthState(auth);

  const onSubmit = async (data) => {
    console.log(id, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    await ContractYacht.bookDate(
      selectedDay.year,
      selectedDay.month,
      selectedDay.day,
      id
    )
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e.reason);
      });


    const fieldToEdit = doc(db, "users", base.user.init[0].id);

    const Booking = `Booking for ${selectedDay.year} ${selectedDay.month} ${selectedDay.day}`;
    const bookingData = [{ Booking: data }, { food: Food }];

    await updateDoc(fieldToEdit, { [Booking]: bookingData })
      .then((res) => {
        console.log(res);
        navigate(`/single-page/${id}`);
      })
      .catch((err) => console.log(err));
  };
  // console.log(errors);

  const [Food, setFood] = useState({ name: "" });
  const [modalIsOpen, setIsOpen] = useState(false);

  function closeMakeOffer() {
    setIsOpen(false);
  }

  const PickYourFood = () => {
    setIsOpen(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bookingForm">
      <div className="title-modal">Cose a date</div>
      {dateError ? (
        <p>
          <span>This date is Already Booked: </span>
          <span>{dateError.day}/</span>
          <span>{dateError.month}/</span>
          <span>{dateError.year}</span>
          <br />
          <span>But you can offer some money to them: </span>
          <br />
          <Link to={`/single-page/${getBookDateID}`}>Make Offer</Link>
        </p>
      ) : (
        ""
      )}
      <DatePicker
        value={selectedDay}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={setSelectedDay}
        inputPlaceholder="Select a day"
        disabledDays={disabledDays} // here we pass them
        onDisabledDayError={handleDisabledSelect} // handle error
        shouldHighlightWeekends
      />

      <input
        type="text"
        autoComplete="off"
        value={Food.name}
        onClick={PickYourFood}
        placeholder="Pick You'r Food"
        {...register("food")}
      />

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeMakeOffer}
        contentLabel="Example Modal"
        className="Modal-PickYourFood"
        overlayClassName="Overlay"
      >
        <button className="x-button" onClick={closeMakeOffer}>
          X
        </button>

        <div className="col">
          <h4>Pick You'r Food</h4>
          <FoodMenu setFood={setFood} setIsOpen={setIsOpen} />
        </div>
      </Modal>

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

      <div className="btn-submit">
        <input className="submit" type="submit" />
      </div>
    </form>
  );
};
