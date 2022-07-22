import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css";
import { ethers } from "ethers";

import DatePicker, {
  utils
} from "@amir04lm26/react-modern-calendar-date-picker";
import Food from "./Food";
import { useContextAPI } from "./../../ContextAPI";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import OfferSidePanel from "./OfferSidePanel";

export default function BookingForm() {
  const { Contract, id } = useParams();
  const { NFTYacht, provider, ContractUSDT, ContractFactory } = useContextAPI();
  const ContractNFTYacht = new ethers.Contract(Contract, NFTYacht, provider);
  const { account, active } = useWeb3React();

  // handle Side Panel
  const [open, setOpen] = useState(false);
  const [food, setFood] = useState({ name: "" });

  // Date Picker
  const [selectedDay, setSelectedDay] = useState(null);
  const [disabledDays, setDisabledDays] = useState([]);

  const date = new Date().toISOString().split("T")[0];
  const minimumDate = {
    year: date.slice(0, 4),
    month: date.slice(5, 7),
    day: date.slice(8, 10)
  };

  const availDate = new Date(new Date().setDate(new Date().getDate() + 20));
  const daysAdded = availDate.toISOString().split("T")[0];
  const maximumDate = {
    year: daysAdded.slice(0, 4),
    month: daysAdded.slice(5, 7),
    day: daysAdded.slice(8, 10)
  };

  const [dateError, setDateError] = useState();
  const [offerSideNav, setOfferSideNav] = useState(false);
  const [getBookDateID, setGetBookDateID] = useState();

  const handleDisabledSelect = async disabledDay => {
    for (let i = 0; i < disabledDays.length; i++) {
      if (disabledDays[i].day === disabledDay.day) {
        await ContractFactory.getBookDateID(
          disabledDay.year,
          disabledDay.month,
          disabledDay.day
        ).then(res => {
          setGetBookDateID(res.toString());
          setDateError(disabledDay);
          setOfferSideNav(true);
        });
      }
    }
  };

  async function afterOpenModal() {
    setDisabledDays([]);

    let newYear = await ContractFactory.newYear();
    let allBookedDates = await ContractFactory.getAllBookedDates(
      newYear.toString()
    );

    if (Number(newYear.toString())) {
      for (let i = 0; i < allBookedDates.length; i++) {
        setDisabledDays(prev =>
          prev.concat({
            year: Number(allBookedDates[i]._year.toString()),
            month: Number(allBookedDates[i]._month.toString()),
            day: Number(allBookedDates[i]._day.toString())
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

  // submit data
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async data => {
    console.log({
      year: selectedDay.year,
      month: selectedDay.month,
      day: selectedDay.day,
      Contract,
      id
    });
    await ContractFactory.bookDate(
      selectedDay.year,
      selectedDay.month,
      selectedDay.day,
      Contract,
      id
    )
      .then(res => {
        console.log(res);
      })
      .catch(e => {
        console.log(e.reason);
      });
  };
  console.log(errors);

  return (
    <>
      {dateError && (
        <OfferSidePanel
          id={id}
          Contract={Contract}
          open={offerSideNav}
          setOpen={setOfferSideNav}
          errordate={dateError}
        />
      )}
      <Food setOpen={setOpen} open={open} setFood={setFood} />
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Booking
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="shadow sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Select Date
                        </label>
                        <DatePicker
                          value={selectedDay}
                          minimumDate={minimumDate}
                          maximumDate={maximumDate}
                          onChange={setSelectedDay}
                          inputPlaceholder="Select a day"
                          className=""
                          disabledDays={disabledDays} // here we pass them
                          onDisabledDayError={handleDisabledSelect} // handle error
                          shouldHighlightWeekends
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Chose Your Food (optional)
                        </label>
                        <input
                          type="text"
                          value={food.name}
                          placeholder="Chose Your Food"
                          onClick={() => setOpen(true)}
                          {...register("Chose Your Food", {})}
                          className="w-full py-2.5 px-3 border mb-4 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Mobile number
                        </label>
                        <input
                          type="tel"
                          placeholder="Mobile number"
                          {...register("Mobile number", {
                            required: true,
                            minLength: 6,
                            maxLength: 12
                          })}
                          className="w-full py-2.5 px-3 border mb-4 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          How many person will you be with?
                        </label>
                        <input
                          type="number"
                          placeholder="How many person will you be with?"
                          {...register("How many person will you be with?", {
                            required: true,
                            max: 12,
                            min: 3
                          })}
                          className="w-full py-2.5 px-3 border mb-4 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Notes (optional)
                        </label>
                        <textarea
                          placeholder="Notes (optional)"
                          {...register("Notes (optional)", {})}
                          className="w-full py-2.5 px-3 border mb-4 rounded-md h-60"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-6">
                        <input
                          className="cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          type="submit"
                          value="Book Dates"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
