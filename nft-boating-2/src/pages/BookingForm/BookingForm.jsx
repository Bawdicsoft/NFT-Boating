import { useState, useEffect, useContext } from "react"
import { useForm } from "react-hook-form"
import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css"
import DatePicker from "@amir04lm26/react-modern-calendar-date-picker"
import Food from "./Food"
import { useContextAPI } from "./../../ContextAPI"
import { useWeb3React } from "@web3-react/core"
import OfferSidePanel from "./OfferSidePanel"
import { useNavigate, useParams } from "react-router-dom"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../../DB/firebase-config"
import { useImmer } from "use-immer"
import StateContext from "../../StateContext"
import DispatchContext from "../../DispatchContext"
import Popup from "./Popup"

export default function BookingForm() {
  const navigate = useNavigate()
  const appState = useContext(StateContext)

  const { Contract, id } = useParams()
  const { ContractFactory, UserData } = useContextAPI()
  const { account, active } = useWeb3React()

  // handle Side Panel
  const [open, setOpen] = useState(false)

  const [state, setState] = useImmer({
    formData: {},
    food: [],
    ContractInfo: { email: "" },
    selectedDay: null,
    minimumDate: {},
    maximumDate: {},
    disabledDays: [],
    dateError: null,
  })
  console.log("food", state.food)

  // Date Picker
  const [selectedDay, setSelectedDay] = useState(null)
  const [disabledDays, setDisabledDays] = useState([])

  const date = new Date().toISOString().split("T")[0]
  const minimumDate = {
    year: date.slice(0, 4),
    month: date.slice(5, 7),
    day: date.slice(8, 10),
  }

  const availDate = new Date(new Date().setDate(new Date().getDate() + 60))
  const daysAdded = availDate.toISOString().split("T")[0]
  const maximumDate = {
    year: daysAdded.slice(0, 4),
    month: daysAdded.slice(5, 7),
    day: daysAdded.slice(8, 10),
  }

  const [dateError, setDateError] = useState()
  const [offerSideNav, setOfferSideNav] = useState(false)

  const handleDisabledSelect = async (disabledDay) => {
    for (let i = 0; i < disabledDays.length; i++) {
      if (disabledDays[i].day === disabledDay.day) {
        await ContractFactory._bookDateID(
          Contract,
          disabledDay.year,
          disabledDay.month,
          disabledDay.day
        ).then((res) => {
          // setGetBookDateID(res.toString())
          setDateError(disabledDay)
          setOfferSideNav(true)
        })
      }
    }
  }

  const fachContractInfo = async () => {
    const docRef = doc(db, "ContractInfo", Contract)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data())
      setState((e) => {
        e.ContractInfo.email = docSnap.data().email
      })
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!")
    }
  }

  async function afterUseEffect() {
    setDisabledDays([])

    let newYear = await ContractFactory._newYear()
    let allBookedDates = await ContractFactory.allBookedDates(
      Contract,
      newYear.toString()
    )

    if (Boolean(allBookedDates.length)) {
      for (let i = 0; i < allBookedDates.length; i++) {
        setDisabledDays((prev) =>
          prev.concat({
            year: Number(allBookedDates[i]._year.toString()),
            month: Number(allBookedDates[i]._month.toString()),
            day: Number(allBookedDates[i]._day.toString()),
            className: "disableDay",
          })
        )
      }
    }
  }

  useEffect(() => {
    if (!active) {
      return
    } else {
      afterUseEffect()
      fachContractInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, Contract])

  // submit data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [openPopup, setOpenPopup] = useState(false)

  const onSubmit = async (data) => {
    const formData = {
      year: selectedDay.year,
      month: selectedDay.month,
      day: selectedDay.day,
      Contract,
      id,
      data,
      OwnerEmail: state.ContractInfo.email,
      userEmail: UserData.email,
      food: appState.food.array,
      total: appState.food.total,
    }

    setState((e) => {
      e.formData = formData
    })
    setOpenPopup(true)
  }

  console.log(errors)

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
      <Food setOpen={setOpen} open={open} setState={setState} state={state} />
      <Popup setOpen={setOpenPopup} open={openPopup} state={state} />
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
                          customDaysClassName={disabledDays}
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
                        <p
                          onClick={() => setOpen(true)}
                          className="w-full py-2.5 px-3 border mb-4 rounded-md"
                        >
                          {appState.food.total > 0
                            ? `$${appState.food.total} total`
                            : "Chose Your Food"}
                        </p>
                        {/* <input
                          type="text"
                          value={appState.food[0]}
                          placeholder="Chose Your Food"
                          {...register("food", {})}
                          className="w-full py-2.5 px-3 border mb-4 rounded-md"
                        /> */}
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
                          {...register("mobileNumber", {
                            required: true,
                            minLength: 6,
                            maxLength: 12,
                          })}
                          className="w-full py-2.5 px-3 border mb-4 rounded-md"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          How many people will you be with?
                        </label>
                        <input
                          type="number"
                          placeholder="How many person will you be with?"
                          {...register("persons", {
                            required: true,
                            max: 12,
                            min: 3,
                          })}
                          className="w-full py-2.5 px-3 border rounded-md"
                        />
                        <p className="text-xs mt-1 mb-4"> Max: 12 people</p>
                      </div>

                      <div className="col-span-6 sm:col-span-6">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Note (optional)
                        </label>
                        <textarea
                          placeholder="Note (optional)"
                          {...register("note", {})}
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
  )
}
