import { useState } from "react";
import { useImmer } from "use-immer";
import OfferSidePanel from "./OfferSidePanel";

export default function NFT() {

  const obj = [
    {
      walletAddress: "0x43..232",
      amount: "3212",
      date: "Sept 28, 2019",
      status: "",
    },
    {
      walletAddress: "0x55..pF4",
      amount: "312",
      date: "Sept 28, 2022",
      status: "",
    },
  ];

  const [open, setOpen] = useState(false)

  const [state,setState] = useImmer({
    owner: false,
    booked:false,
    user: true
  })

  const booknowFunc = () => {
    setState((draft) => {
      draft.booked = true
    })  
  };

  const cancelbookFunc = () => {
    setState((draft) => {
      draft.booked = false
    })
  }

  const offerFunc = () => {
    setOpen(true)
  }

  return (
    <>
    
    <OfferSidePanel open={open} setOpen={setOpen}/>
    
    <div className="NFT min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">NFT</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8"> */}
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-5 md:gap-10">
              <div className="md:col-span-2">
                <div className="px-4 sm:px-0">
                  <img
                    src="https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg"
                    alt="Walnut card tray with white powder coated steel divider and 3 punchout holes."
                    className="bg-gray-100 rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-3">
                <div>19 July 2022</div>
                <h1 className="text-3xl mt-4 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Technical Specifications
                </h1>
                <p className="mt-4 text-gray-500">
                  The walnut wood card tray is precision milled to perfectly fit
                  a stack of Focus cards. The powder coated steel divider
                  separates active cards from new ones, or can be used to
                  archive important task lists.
                </p>

                <div className="md:grid md:grid-cols-4 md:gap-3">
                  {state.owner && !state.booked && (
                    <>
                      <button onClick={booknowFunc} className="md:col-span-2 cursor-pointer mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Book Now
                      </button>
                    </>
                  )}
                  {state.owner && state.booked && (
                    <button onClick={cancelbookFunc} className="md:col-span-2 cursor-pointer mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Cancel
                    </button>
                  )}
                  {state.user && (
                    <button onClick={offerFunc} className="md:col-span-2 cursor-pointer mt-10 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Make Offer
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
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {obj.map((item) => {
                              return (
                                <tr>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-600 whitespace-no-wrap">
                                      {item.walletAddress}
                                    </p>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      ${item.amount}
                                    </p>
                                    <p className="text-gray-600 whitespace-no-wrap">
                                      USD
                                    </p>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <p className="text-gray-900 whitespace-no-wrap">
                                      {item.date}
                                    </p>
                                    <p className="text-gray-600 whitespace-no-wrap">
                                      Due in 3 days
                                    </p>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                      <span
                                        aria-hidden
                                        className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                      ></span>
                                      <span className="relative">Paid</span>
                                    </span>
                                  </td>
                                  {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                <button
                                  type="button"
                                  className="inline-block text-gray-500 hover:text-gray-700"
                                >
                                  <svg
                                    className="inline-block h-6 w-6 fill-current"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm-2 6a2 2 0 104 0 2 2 0 00-4 0z" />
                                  </svg>
                                </button>
                              </td> */}
                                </tr>
                              );
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
          {/* </div> */}
        </div>
      </main>
    </div>
    </>
  );
}
