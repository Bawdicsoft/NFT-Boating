import { useEffect } from "react"
import { useImmer } from "use-immer"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { useContextAPI } from "../../../ContextAPI"
import { ethers } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { useWeb3React } from "@web3-react/core"
import { db } from "../../../DB/firebase-config"
import { doc, getDoc } from "firebase/firestore"
import { Injected } from "../../../Comp/Wallets/Connectors"

export default function NFT() {
  const { Contract, id } = useParams()
  const { NFTYacht, provider, ContractFactory, UserData, ContractDeploy } =
    useContextAPI()
  const ContractNFTYacht = new ethers.Contract(Contract, NFTYacht, provider)
  const { account, active, activate } = useWeb3React()

  const [state, setState] = useImmer({
    imageSrc: null,
    imageAlt: null,
    ContractInfo: { name: "xxxx", email: "", featuredImage: null },
    contract: {
      name: "xxxx",
      symbol: "xx",
      isOwner: false,
      isBooked: false,
      bookedDate: "",
    },
    offer: [],
  })

  console.log({ state })

  const fetch = async () => {
    let contractData
    try {
      contractData = await ContractDeploy.contractDitals(Contract)
    } catch (error) {
      console.log(error)
    }

    const name = contractData.name.toString()
    const symbol = contractData.symbol.toString()
    const baseURI = contractData.baseURI.toString()

    setState((draft) => {
      draft.contract.name = name
      draft.contract.symbol = symbol
    })

    // const getBaseURL = baseURI.split("//").pop()
    // console.log({ getBaseURL })
    // const ipfsRes = await axios.get(
    //   `https://gateway.pinata.cloud/ipfs/${getBaseURL}/`
    // )
    // console.log(ipfsRes.data.image)
    // setState((draft) => {
    //   draft.imageSrc = ipfsRes.data.image
    //   draft.imageAlt = `${name} (${symbol})`
    // })

    const ownerOf = await ContractNFTYacht.ownerOf(id)
    const BookedDate = await ContractFactory.BookedDate(Contract, id)

    var t = new Date(1970, 0, 1) // Epoch
    t.setSeconds(BookedDate[1].toString()).toLocaleString()

    console.log(Boolean(BookedDate.bookedTime_.toString() > 0))

    setState((draft) => {
      draft.contract.isOwner = ownerOf === account
      draft.contract.isBooked = Boolean(BookedDate.bookedTime_.toString() > 0)
      draft.contract.bookedDate = t.toString()
    })

    const Offer = await ContractFactory._offers(Contract, id)

    if (Boolean(Offer.userID.toString() > 0)) {
      var tt = new Date(1970, 0, 1) // Epoch
      tt.setSeconds(Offer.Time.toString()).toLocaleString()

      const data = {
        id: Offer.id.toString(),
        userID: Offer.userID.toString(),
        price: formatEther(Offer.Price.toString()),
        time: tt.toString(),
        offeredDate: Offer.offeredDate.toString(),
        user: Offer.User,
        contract: Offer.Contract,
      }

      console.log(data)

      setState((draft) => {
        draft.offer.push(data)
      })
    }
  }
  useEffect(() => {
    if (active) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    const fetchContractInfo = async () => {
      const docRef = doc(db, "ContractInfo", Contract)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data())
        setState((e) => {
          e.ContractInfo = docSnap.data()
        })
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!")
      }
    }
    fetchContractInfo()
  }, [Contract])

  const cancelBooking = async (Contract, id) => {
    try {
      await ContractFactory.cancelBooking(Contract, id)

      const Mail = {
        fromName: "NFT Boating",
        from: "nabeelatdappvert@gmail.com",
        to: `nabeelatdappvert@gmail.com, ${state.ContractInfo.email}, ${UserData.email}`,
        subject: "user has cancelled the booking",
        text: `user has cancelled the booking \n
        date: ${state.contract.bookedDate}`,
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
                  <th>confirmation</th>
                </tr>
                <tr style="background-color: #eaeaea">
                  <td>user has cancelled the booking</td>
                </tr>
                <tr>
                  <th>Date</th>
                </tr>
                <tr style="background-color: #eaeaea">
                  <td>${state.contract.bookedDate}</td>
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

      setState((draft) => {
        draft.isBooked = false
      })

      fetch()
    } catch (error) {
      console.error(error)
    }
  }

  const handelAcceptOffer = async (contract, id) => {
    await ContractFactory.acceptOffer(contract, id)
      .then(async (r) => {
        console.log(r)

        const Mail = {
          fromName: "NFT Boating",
          from: "nabeelatdappvert@gmail.com",
          to: `nabeelatdappvert@gmail.com, ${state.ContractInfo.email}, ${UserData.email}`,
          subject: "user has accepted the offer",
          text: `user has accepted the offer price \n
          date: ${state.contract.bookedDate} \n
          ownerAddress: ${contract} \n
          memberShip ID: ${id}`,
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
                    <td>user has accepted the offer price</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                  </tr>
                  <tr style="background-color: #eaeaea">
                    <td>${state.contract.bookedDate}</td>
                  </tr>
                  <tr>
                    <th>Info</th>
                  </tr>
                  <tr style="background-color: #eaeaea">
                    <td>${contract} (${id})</td>
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

        fetch()
      })
      .catch((e) => e.reason)
  }

  return (
    <>
      <div className="NFT min-h-full">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">NFTt</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="mt-10 sm:mt-0">
              <div className="md:grid md:grid-cols-5 md:gap-10">
                <div className="md:col-span-2">
                  <div className="px-4 sm:px-0">
                    <img
                      src={state.ContractInfo.featuredImage}
                      className="bg-gray-100 rounded-lg w-full"
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-3">
                  {state.contract.isBooked && (
                    <span className="mt-6 cursor-pointer bg-red-50 text-red-600  p-3 py-2 rounded-md shadow">
                      {state.contract.bookedDate}
                    </span>
                  )}
                  <h1 className="text-3xl mt-4 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    {state.ContractInfo.name}
                  </h1>
                  <p className="mt-4 text-gray-500">
                    The walnut wood card tray is precision milled to perfectly
                    fit a stack of Focus cards. The powder coated steel divider
                    separates active cards from new ones, or can be used to
                    archive important task lists.
                  </p>

                  <div className="md:grid md:grid-cols-4 md:gap-3">
                    {account ? (
                      <>
                        {state.contract.isOwner && !state.contract.isBooked && (
                          <>
                            <Link
                              to={`/Contract/${Contract}/Booking-form/${id}`}
                              className="md:col-span-2 cursor-pointer mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Book Now
                            </Link>
                          </>
                        )}
                        {state.contract.isOwner && state.contract.isBooked && (
                          <button
                            onClick={() => cancelBooking(Contract, id)}
                            className="md:col-span-2 cursor-pointer mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Cancel
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={async () => await activate(Injected)}
                        className="md:col-span-2 cursor-pointer mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Connect To Wallet
                      </button>
                    )}
                  </div>

                  <div className="container mx-auto px-4 sm:px-8">
                    <div className="py-8">
                      <div>
                        <h2 className="text-2xl font-semibold leading-tight">
                          Offers
                        </h2>
                      </div>
                      <div className="-mx-4 sm:-mx-14 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                          <table className="min-w-full leading-normal">
                            <thead>
                              <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Address
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Amount
                                </th>
                                {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  Date
                                </th> */}
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                  {/* Status */}
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {state.offer.map((item) => {
                                return (
                                  <tr key={item.offeredDate}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      <p className="text-gray-600 whitespace-no-wrap">
                                        {`${item.user.slice(
                                          0,
                                          5
                                        )}...${item.user.slice(-4)}`}
                                      </p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        USD: {item.price}
                                      </p>
                                    </td>
                                    {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      <p className="text-gray-900 whitespace-no-wrap">
                                        {item.offeredDate}
                                      </p>
                                    </td> */}
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      <button
                                        onClick={() =>
                                          handelAcceptOffer(
                                            item.contract,
                                            item.id
                                          )
                                        }
                                        className="cursor-pointer bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-end font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      >
                                        Accept
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
