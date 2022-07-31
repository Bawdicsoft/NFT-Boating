import { useEffect } from "react"
import { useImmer } from "use-immer"
import { useContextAPI } from "../../../ContextAPI"
import { useWeb3React } from "@web3-react/core"
import { formatEther } from "ethers/lib/utils"

export default function OffersMade() {
  const { ContractFactory } = useContextAPI()
  const { account, active } = useWeb3React()

  const [state, setState] = useImmer({
    offerMade: [
      {
        Contract: "",
        IDs: [],
      },
    ],
    offer: [],
    isLoding: true,
  })

  useEffect(() => {
    if (active) {
      async function getAllContractAddress() {
        const getAllContractAddress =
          await ContractFactory.UserAllContractAddress(account)

        console.log(getAllContractAddress, "getAllContractAddress>>>>")

        for (let i = 0; i < getAllContractAddress.length; i++) {
          const getUserAllOffers = await ContractFactory.userAllOffers(
            getAllContractAddress[i],
            account
          )

          console.log("getUserAllOffers", getUserAllOffers)

          for (let j = 0; j < getUserAllOffers.length; j++) {
            const Offer = await ContractFactory._offers(
              getAllContractAddress[i],
              getUserAllOffers[j]
            )

            console.log(Offer)

            if (Number(Offer.id.toString()) > 0) {
              var t = new Date(1970, 0, 1) // Epoch
              t.setSeconds(Offer.Time.toString()).toLocaleString()

              console.log("t.toString()", t.toString())

              const data = {
                id: Offer.id.toString(),
                userID: Offer.userID.toString(),
                price: formatEther(Offer.Price.toString()),
                time: t.toString(),
                offeredDate: Offer.offeredDate.toString(),
                user: Offer.User.toString(),
                contract: Offer.Contract.toString(),
              }

              setState((e) => {
                e.offer.push(data)
              })
            }
          }

          const data = {
            Contract: getAllContractAddress[i].toString(),
            IDs: getUserAllOffers.toString(),
          }

          setState((e) => {
            e.offerMade.push(data)
          })
        }
      }
      getAllContractAddress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const handleCancel = async (id, contract) => {
    console.log(contract, id)
    await ContractFactory.cancelOffer(contract, id)
      .then((r) => {
        console.log(r)
      })
      .catch((e) => console.log(e.reason))
  }

  return (
    <div className="OffersMade min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Offers Made</h1>
          <p className="max-w-2xl">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque
            ipsa commodi accusamus cupiditate blanditiis nihil voluptas
            architecto numqquam, omnis delecctus ipsa adippisicing?
          </p>
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
                      {state.offer.map((item) => {
                        return (
                          <tr key={item.offeredDate}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-600 whitespace-no-wrap">
                                {`${item.user.slice(0, 5)}...${item.user.slice(
                                  -4
                                )}`}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                USDT: {item.price}
                              </p>
                              {/* <p className="text-gray-600 whitespace-no-wrap">
                                USD
                              </p> */}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {item.time}
                              </p>
                              {/* <p className="text-gray-600 whitespace-no-wrap">
                                Due in 3 days
                              </p> */}
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
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <button
                                onClick={() =>
                                  handleCancel(item.id, item.contract)
                                }
                                className="cursor-pointer bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-end font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Cancel
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
  )
}
