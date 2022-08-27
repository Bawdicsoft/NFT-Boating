import { Fragment, useEffect, useState } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { BellIcon, MenuIcon, CashIcon, XIcon } from "@heroicons/react/outline"
import { Link, useNavigate } from "react-router-dom"
import { auth, db, logout, signInWithGoogle } from "../../../DB/firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"
import { useImmer } from "use-immer"
import { collection, getDocs } from "firebase/firestore"
import BookedDatesSidePanel from "./BookedDatesSidePanel"

export default function BookedDates() {
  const [user, loading, error] = useAuthState(auth)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const [state, setState] = useImmer({
    openSidebar: false,
    BookingInfo: [],
    data: {
      date: {
        year: null,
        month: null,
        day: null,
      },
      contractinfo: { Contract: "oxoooooooooooooooo", id: null },
      mobileNumber: null,
      persons: null,
      food: null,
      note: null,
    },
  })

  useEffect(() => {
    if (loading) {
      return
    } else {
      const fetchData = async () => {
        if (1 > 0) {
          try {
            const querySnapshot = await getDocs(collection(db, "BookingInfo"))
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data())
              setState((e) => {
                e.BookingInfo.push(doc.data())
              })
            })
          } catch (error) {
            console.log(error)
          }
        }
      }
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  console.log(error)

  const hendleView = (data) => {
    console.log(data)
    setState((e) => {
      e.data = data
    })
    setOpen(true)
  }

  return (
    <>
      <BookedDatesSidePanel
        open={open}
        setOpen={setOpen}
        state={state}
        setState={setState}
      />
      <div className="OffersReceived min-h-full">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">All Booked Dates</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="container mx-auto px-4 sm:px-8">
              <div className="py-2">
                <div className="-mx-4 sm:-mx-14 px-4 sm:px-8 py-4 overflow-x-auto">
                  <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Contract
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            mobileNumber
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            persons
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.BookingInfo.map((item, index) => {
                          return (
                            <tr key={item.contractinfo.Contract}>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-600 whitespace-no-wrap">
                                  {item.contractinfo.Contract.slice(0, 5)}...
                                  {item.contractinfo.Contract.slice(-4)}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {item.mobileNumber}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {item.persons}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">
                                  {item.date.day}/{item.date.month}/
                                  {item.date.year}
                                </p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <button
                                  onClick={() => hendleView(item)}
                                  className="cursor-pointer bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-end font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
