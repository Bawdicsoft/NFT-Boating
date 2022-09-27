/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext, useMemo, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationIcon } from "@heroicons/react/outline"
import DispatchContext from "../../DispatchContext"
import axios from "axios"
import { db } from "../../DB/firebase-config"
import { doc, setDoc } from "firebase/firestore"
import { useContextAPI } from "../../ContextAPI"
import { useNavigate } from "react-router-dom"
import StateContext from "../../StateContext"
import { formatUnits, parseUnits } from "ethers/lib/utils"
import { useForm } from "react-hook-form"
import { useImmer } from "use-immer"
import { useWeb3React } from "@web3-react/core"

export default function Popup({ open, setOpen, state }) {
  const ConformButtonRef = useRef(null)
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  console.log(appState.food.total)

  const navigate = useNavigate()
  const {
    ContractFactory,
    ContractUSDT,
    ContractNFTilityToken,
    ContractNFTilityExchange,
  } = useContextAPI()

  const submit = async () => {
    let data = {
      year: state.formData.year,
      month: state.formData.month,
      day: state.formData.day,
      Contract: state.formData.Contract,
      id: state.formData.id,
      selectedToken: state.formData.selectedToken,
      specialDayAmount: state.formData.specialDayAmount,
    }
    console.log(data, "data")

    try {
      const tx = await ContractFactory.bookDate(
        state.formData.year,
        state.formData.month,
        state.formData.day,
        state.formData.Contract,
        state.formData.id,
        state.formData.selectedToken,
        state.formData.specialDayAmount
      )
      await tx.wait()
    } catch (e) {
      console.error(e)
    }

    console.log(state.formData)

    try {
      let tx
      if (innerState.selectToken === "USDT") {
        tx = await ContractUSDT.transfer(
          "0x344A0e306cdD004508b19C51Ec5c646500acd2f6",
          parseUnits(innerState.totalFee.toString(), 6)
        )
      } else if (innerState.selectToken === "NNT") {
        tx = await ContractNFTilityToken.transfer(
          "0x344A0e306cdD004508b19C51Ec5c646500acd2f6",
          parseUnits(innerState.totalFee.toString(), 18)
        )
      }
      await tx.wait()
    } catch (e) {
      console.error(e)
    }

    let foodHtmlList = ""
    if (appState.food.array == !undefined) {
      for (let i = 0; i < appState.food.array.length; i++) {
        const element = appState.food.array[i]
        for (const key in element) {
          foodHtmlList += `<tr>
            <th>${key}</th>
          </tr>
          <tr style="background-color: #eaeaea">
            <td>${element[key]}</td>
          </tr>`
        }
      }
    }

    const Mail = {
      fromName: "NFT Boating",
      from: "nabeelatdappvert@gmail.com",
      to: `${process.env.REACT_APP_EMAIL}, ${state.formData.OwnerEmail}, ${state.formData.userEmail}`,
      subject: "New Date Was Booked",
      text: `date: {
          year: ${state.formData.year},
          month: ${state.formData.month},
          day: ${state.formData.day},
        },
        contractinfo: { ${state.formData.Contract}, ${state.formData.id} },
        mobileNumber: ${state.formData.data.mobileNumber},
        persons: ${state.formData.data.persons},
        food: ${JSON.stringify(state.formData.food)},
        total: ${appState.food.total},
        note: ${state.formData.data.note},`,
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>EMAIL</title>
        </head>
        <body>
          <div
            style="
              text-align: left;
              width: 100%;
              max-width: 500px;
              padding: 20px;
              background-color: #f6f6f6;
              margin: auto;
            "
          >
            <h1 style="text-align: center">NFT Boating</h1>
            <table style="width: 100%">
              <tr>
                <th>Confirmation</th>
              </tr>
              <tr style="background-color: #eaeaea">
                <td>New Date Was Booked</td>
              </tr>
              <tr>
                <th>Date</th>
              </tr>
              <tr style="background-color: #eaeaea">
                <td>${state.formData.month}/${state.formData.day}/${state.formData.year}</td>
              </tr>
              <tr>
                <th>contractinfo</th>
              </tr>
              <tr style="background-color: #eaeaea">
                <td>${state.formData.Contract} (${state.formData.id})</td>
              </tr>
              <tr>
                <th>Mobile Number</th>
              </tr>
              <tr style="background-color: #eaeaea">
                <td>${state.formData.data.mobileNumber}</td>
              </tr>
              <tr>
                <th>Total Persons</th>
              </tr>
              <tr style="background-color: #eaeaea">
                <td>${state.formData.data.persons}</td>
              </tr>
              <br />
              <h4>Food</h4>
              ${foodHtmlList}
              <tr>
                <th>Total Food Amount</th>
              </tr>
              <tr style="background-color: #eaeaea">
                <td>${appState.food.total}</td>
              </tr>
              <br />
              <tr>
                <th>Note</th>
              </tr>
              <tr style="background-color: #eaeaea">
                <td>${state.formData.data.note}</td>
              </tr>
            </table>
            <br />
            <p style="text-align: center">
              <a href="https://">CopyRight: NFT Boating</a>
            </p>
          </div>
        </body>
      </html>
      `,
    }
    const res = await axios.post(
      "https://nft-boating-mail.herokuapp.com/email",
      Mail
    )
    console.log(res.data.msg)

    try {
      // set doc in db
      const date = `${state.formData.day}-${state.formData.month}-${state.formData.year}`
      console.log(date)
      await setDoc(doc(db, state.formData.Contract, date), {
        date: {
          year: state.formData.year,
          month: state.formData.month,
          day: state.formData.day,
        },
        contractinfo: {
          Contract: state.formData.Contract,
          id: state.formData.id,
        },
        mobileNumber: state.formData.data.mobileNumber,
        persons: state.formData.data.persons,
        food: state.formData.food,
        total: appState.food.total,
        note: state.formData.data.note,
      })
    } catch (error) {
      console.log(error)
    }

    try {
      // set doc in db
      const date = `${state.formData.day}-${state.formData.month}-${state.formData.year}`
      console.log(date)
      await setDoc(doc(db, "BookingInfo", date), {
        date: {
          year: state.formData.year,
          month: state.formData.month,
          day: state.formData.day,
        },
        contractinfo: {
          Contract: state.formData.Contract,
          id: state.formData.id,
        },
        mobileNumber: state.formData.data.mobileNumber,
        persons: state.formData.data.persons,
        food: state.formData.food,
        total: appState.food.total,
        note: state.formData.data.note,
      })
    } catch (error) {
      console.log(error)
    }

    appDispatch({ type: "food", value: {} })

    navigate(`/contract/${state.formData.Contract}/nft/${state.formData.id}`)
  }

  const [innerState, setInnerState] = useImmer({
    userBalance: "00",
    foodTotal: "00",
    fuelTotal: "00",
    captainFee: "00",
    totalFee: "00",
    selectToken: "USDT",
  })

  const { register, watch } = useForm()

  const { account, active } = useWeb3React()

  const selectToken = watch("selectToken")

  const selectedToken = async (Token) => {
    if (Token === "USDT") {
      console.log("innerState.fuelTotalUSDT", innerState)

      if (active) {
        try {
          const userBalance = await ContractUSDT.balanceOf(account)

          let totalFee
          if (Number(appState.food.total) > 0) {
            totalFee = Number(appState.food.total) + 400
          } else {
            totalFee = 400
          }

          setInnerState((draft) => {
            draft.fuelTotal = "200"
            draft.captainFee = "200"
            draft.foodTotal = appState.food.total
            draft.userBalance = formatUnits(userBalance.toString(), 6)
            draft.totalFee = totalFee
            draft.selectToken = "USDT"
          })
        } catch (e) {
          console.log(e)
        }
      }
    } else if (Token === "NNT") {
      console.log(Token)

      if (active) {
        try {
          const userBalance = await ContractNFTilityToken.balanceOf(account)
          console.log(userBalance)

          const ExchangeRatePrice = await ContractNFTilityExchange.price()

          let foodTotal
          if (Number(appState.food.total) > 0) {
            foodTotal =
              Number(appState.food.total) * Number(ExchangeRatePrice.toString())
          } else {
            foodTotal = 0
          }

          const fuelTotal =
            Number(innerState.fuelTotal) * Number(ExchangeRatePrice.toString())

          const captainFee =
            Number(innerState.captainFee) * Number(ExchangeRatePrice.toString())

          const totalFee = foodTotal + fuelTotal + captainFee

          setInnerState((draft) => {
            draft.userBalance = formatUnits(userBalance.toString(), 18)
            draft.foodTotal = foodTotal
            draft.fuelTotal = fuelTotal
            draft.captainFee = captainFee
            draft.totalFee = totalFee
            draft.selectToken = "NNT"
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
  useMemo(() => {
    selectedToken(selectToken)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectToken])

  const calculateUSDT = async () => {
    console.log("hello from calculateUSDT")
    if (active) {
      const userBalance = await ContractUSDT.balanceOf(account)
      console.log(userBalance)

      let totalFee
      if (Number(appState.food.total) > 0) {
        totalFee = Number(appState.food.total) + 400
      } else {
        totalFee = 400
      }

      setInnerState((draft) => {
        draft.fuelTotal = "200"
        draft.captainFee = "200"
        draft.foodTotal = appState.food.total
        draft.userBalance = formatUnits(userBalance.toString(), 6)
        draft.totalFee = totalFee
        draft.selectToken = "USDT"
      })
    }
  }

  useMemo(() => {
    calculateUSDT()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, appState.food.total])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={ConformButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-[350px] sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg text-center leading-6 font-medium text-gray-900"
                    >
                      Booking Receipt
                    </Dialog.Title>
                    <hr className="border border-dashed border-gray-700 mt-4" />
                    <div className="mt-2">
                      <form>
                        {innerState.foodTotal > 0 && (
                          <div className="grid grid-cols-2">
                            <p className="text-sm font-medium text-left text-gray-700 mb-2">
                              food total :
                            </p>
                            <p className="text-sm font-medium text-right text-gray-700 mb-2">
                              {innerState.foodTotal} {innerState.selectToken}
                            </p>
                          </div>
                        )}
                        <div className="grid grid-cols-2">
                          <p className="text-sm font-medium text-left text-gray-700 mb-2">
                            Fuel total :
                          </p>
                          <p className="text-sm font-medium text-right text-gray-700 mb-2">
                            {innerState.fuelTotal} {innerState.selectToken}
                          </p>
                        </div>
                        <div className="grid grid-cols-2">
                          <p className="text-sm font-medium text-left text-gray-700 mb-2">
                            Captain fee :
                          </p>
                          <p className="text-sm font-medium text-right text-gray-700 mb-2">
                            {innerState.captainFee} {innerState.selectToken}
                          </p>
                        </div>
                        <hr className="border border-dashed border-gray-700 mt-1" />
                        <div className="grid grid-cols-2">
                          <p className="text-sm font-medium text-left text-gray-700 my-2">
                            Total :
                          </p>
                          <p className="text-sm font-medium text-right text-gray-700 my-2">
                            {innerState.totalFee} {innerState.selectToken}
                          </p>
                        </div>
                        <hr className="border border-dashed border-gray-700" />

                        <div className="grid grid-cols-6 gap-2 text-left mt-4">
                          <div className="col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chose token :
                            </label>
                            <select
                              className="w-full py-2 px-2 border rounded-md"
                              defaultValue="USDT"
                              {...register("selectToken", {
                                required: true,
                              })}
                            >
                              <option value="USDT">USDT ( TetherToken )</option>
                              <option value="NNT">NNT ( NFTilityToken )</option>
                            </select>
                          </div>

                          <div className="col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Your balance in {innerState.selectToken}
                            </label>
                            <p className="w-full py-2 px-2 border mb-2 rounded-md">
                              <span>{innerState.userBalance}</span>
                            </p>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={submit}
                  >
                    2 | Confirm
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
