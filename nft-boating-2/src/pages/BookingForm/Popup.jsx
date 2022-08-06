/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationIcon } from "@heroicons/react/outline"
import DispatchContext from "../../DispatchContext"
import axios from "axios"
import { db } from "../../DB/firebase-config"
import { doc, setDoc } from "firebase/firestore"
import { useContextAPI } from "../../ContextAPI"
import { useNavigate } from "react-router-dom"
import StateContext from "../../StateContext"

export default function Popup({ open, setOpen, state }) {
  const cancelButtonRef = useRef(null)
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  console.log(appState.food.array)

  const navigate = useNavigate()
  const { ContractFactory, UserData } = useContextAPI()

  //   const formData = {
  //     year: selectedDay.year,
  //     month: selectedDay.month,
  //     day: selectedDay.day,
  //     Contract,
  //     id,
  //     data,
  //     OwnerEmail: state.ContractInfo.email,
  //     userEmail: UserData.email,
  //     food: appState.food.array,
  //     total: appState.food.total,
  //   }

  const submit = async () => {
    try {
      const tx = await ContractFactory.bookDate(
        state.formData.year,
        state.formData.month,
        state.formData.day,
        state.formData.Contract,
        state.formData.id
      )
      await tx.wait()
    } catch (e) {
      console.error(e)
    }

    let foodHtmlList = ""
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

    const Mail = {
      fromName: "NFT Boating",
      from: "nabeelatdappvert@gmail.com",
      to: `nabeelatdappvert@gmail.com, ${state.formData.OwnerEmail}, ${state.formData.userEmail}`,
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
        total: ${state.formData.total},
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
                <td>${state.formData.total}</td>
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
        total: state.formData.total,
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
        total: state.formData.total,
        note: state.formData.data.note,
      })
    } catch (error) {
      console.log(error)
    }

    appDispatch({ type: "food", value: {} })

    navigate(`/contract/${state.formData.Contract}/nft/${state.formData.id}`)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
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
              <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Booking Receipt
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-2">
                          food total: ${state.formData.total}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Fuel total: $200
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Captian fee: $200
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={submit}
                  >
                    Conform
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
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
