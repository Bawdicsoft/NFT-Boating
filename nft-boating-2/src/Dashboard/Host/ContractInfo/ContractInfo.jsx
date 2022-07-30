import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ethers } from "ethers"
import { useContextAPI } from "./../../../ContextAPI"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { auth, db } from "./../../../DB/firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"
import BookedDatesSidePanel from "./BookedDatesSidePanel"

export default function ContractInfo() {
  const { Contract } = useParams()
  const [open, setOpen] = useState(false)

  const [State, SetState] = useImmer({
    Contract: {
      name: "name",
      symbol: "symbol",
    },
    product: {
      name: ".....",
      symbol: "..",
      totalSupply: "00",
      price: "0.0",
      walletAddress: "0x0000000000000000000000",
      images: [],
      description: "................",
    },
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
    isLoading: true,
  })

  useEffect(() => {
    const run = async () => {
      const docRef = doc(db, "ContractInfo", Contract)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data())
        SetState((d) => {
          d.product.name = docSnap.data().data.name
          d.product.symbol = docSnap.data().data.symbol
          d.product.totalSupply = docSnap.data().data.totalSupply
          d.product.price = docSnap.data().data.price
          d.product.walletAddress = docSnap.data().data.walletAddress
          d.product.images = docSnap.data().imgUrls
          d.product.description = docSnap.data().data.description
          d.isLoading = false
        })

        try {
          const querySnapshot = await getDocs(collection(db, Contract))
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data())
            SetState((e) => {
              e.BookingInfo.push(doc.data())
            })
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!")
      }
    }
    run()
  }, [Contract])

  const hendleView = (data) => {
    console.log(data)
    SetState((e) => {
      e.data = data
    })
    setOpen(true)
  }

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {State.product.name} ({State.product.symbol}) USDT:{" "}
            {State.product.price}
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div
            className={
              ` bg-slate-500 rounded-lg h-96 ` +
              (State.isLoading && "animate-pulse")
            }
          >
            <img
              src={State.product.images[0]}
              // alt={product.images[0].alt}
              className="w-screen h-96 bg-slate-500 object-center object-cover rounded-lg"
            />
          </div>

          <BookedDatesSidePanel
            open={open}
            setOpen={setOpen}
            state={State}
            setState={SetState}
          />

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
                        {State.BookingInfo.map((item, index) => {
                          return (
                            <tr key={index}>
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
          {/* /End replace */}
        </div>
      </main>
    </>
  )
}
