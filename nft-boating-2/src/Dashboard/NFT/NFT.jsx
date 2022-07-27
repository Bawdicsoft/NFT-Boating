import { useEffect } from "react"
import { useImmer } from "use-immer"
import { useParams, Link } from "react-router-dom"
import { useContextAPI } from "../../ContextAPI"
import { ethers } from "ethers"
import { formatEther } from "ethers/lib/utils"
import { useWeb3React } from "@web3-react/core"

export default function NFT() {
  const { Contract, id } = useParams()
  const { NFTYacht, provider, ContractFactory } = useContextAPI()
  const ContractNFTYacht = new ethers.Contract(Contract, NFTYacht, provider)
  const { account, active } = useWeb3React()

  const [state, setState] = useImmer({
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

  useEffect(() => {
    if (active) {
      const fetch = async () => {
        const name = await ContractNFTYacht.name()
        const symbol = await ContractNFTYacht.symbol()

        setState((draft) => {
          draft.contract.name = name
          draft.contract.symbol = symbol
        })

        const ownerOf = await ContractNFTYacht.ownerOf(id)
        const BookedDate = await ContractFactory.BookedDate(Contract, id)

        var t = new Date(1970, 0, 1) // Epoch
        t.setSeconds(BookedDate[1].toString()).toLocaleString()

        console.log(Boolean(BookedDate.bookedTime_.toString() > 0))

        setState((draft) => {
          draft.contract.isOwner = ownerOf === account
          draft.contract.isBooked = Boolean(
            BookedDate.bookedTime_.toString() > 0
          )
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
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const cancelBooking = async (Contract, id) => {
    try {
      await ContractFactory.cancelBooking(Contract, id)
      setState((draft) => {
        draft.isBooked = false
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handelAcceptOffer = async (contract, id) => {
    await ContractFactory.acceptOffer(contract, id)
      .then((r) => {
        console.log(r)
      })
      .catch((e) => e.reason)
  }

  return (
    <>
      <div className="NFT min-h-full">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">NFT</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="mt-10 sm:mt-0">
              <div className="md:grid md:grid-cols-5 md:gap-10">
                <div className="md:col-span-2">
                  <div className="px-4 sm:px-0">
                    <img
                      src={`https://cloudflare-ipfs.com/ipfs/Qmacuvgf1m4j35prXdbUJhmkycpYDk2Km9rZEhMv2Causz/${id}.png`}
                      alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                      className="bg-gray-100 rounded-lg"
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
                    {`${state.contract.name}(${state.contract.symbol})`}
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
                      "Not Connected To Wallet"
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
