import { useEffect } from "react"
import { useImmer } from "use-immer"
import { useContextAPI } from "./../../ContextAPI"
import { useWeb3React } from "@web3-react/core"

export default function BookedDate() {
  const { ContractFactory } = useContextAPI()
  const { account, active } = useWeb3React()

  const [state, setState] = useImmer({
    bookedDates: [],
    tBookedDates: 0,
  })

  useEffect(() => {
    if (active) {
      async function getBookedDates() {
        const addresses = await ContractFactory.UserAllContractAddress(account)

        if (addresses.length) {
          for (let i = 0; i < addresses.length; i++) {
            const UserIDs = await ContractFactory.UserIDs(addresses[i], account)

            for (let j = 0; j < UserIDs.length; j++) {
              const BookedDate = await ContractFactory.BookedDate(
                addresses[i],
                UserIDs[j]
              )

              var bookingTime = new Date(1970, 0, 1) // Epoch
              bookingTime
                .setSeconds(BookedDate._blockTimestamp)
                .toLocaleString()

              var bookedTime = new Date(1970, 0, 1) // Epoch
              bookedTime.setSeconds(BookedDate._DateAndTime).toLocaleString()

              const data = {
                id: UserIDs[j].toString(),
                contract: addresses[i],
                bookingTime: bookingTime.toString(),
                bookedTime: bookedTime.toString(),
                newYear: BookedDate._newYear,
              }

              setState((e) => {
                e.bookedDates.push(data)
              })
            }

            setState((e) => {
              e.tBookedDates = UserIDs.length
            })
          }
        }
      }
      getBookedDates()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const cancelBooking = async (Contract, id) => {
    console.log(">>>>>>>>>>>", Contract, id)
    try {
      await ContractFactory.cancelBooking(Contract, id)
      setState((draft) => {
        draft.isBooked = false
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="BookedDate min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Booked Dates</h1>
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
                          Smart Contract
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Id
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Booking Date
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Booked Date
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.bookedDates.map((item) => {
                        return (
                          <tr key={item.bookingTime}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-600 whitespace-no-wrap">
                                {`${item.contract.slice(
                                  0,
                                  5
                                )}...${item.contract.slice(-4)}`}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {item.id}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {item.bookingTime}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {item.bookedTime}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <button
                                onClick={() =>
                                  cancelBooking(item.contract, item.id)
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
