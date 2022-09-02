/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useMemo } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { useContextAPI } from "../../../ContextAPI"
import { XIcon } from "@heroicons/react/outline"
import { useImmer } from "use-immer"

export default function WithdrewAmount({ open, setOpen, Contract }) {
  const { ContractFactory } = useContextAPI()

  const [state, setState] = useImmer({ specialDays: [] })

  const fetchData = async () => {
    const specialDays = await ContractFactory.specialDays(Contract)
    console.log(specialDays)

    for (let i = 0; i < specialDays.length; i++) {
      const element = specialDays[i]
      const specialDayOwnerUSDT = await ContractFactory.specialDayOwnerUSDT(
        Contract,
        element._year,
        element._month,
        element._day
      )
      const specialDayOwnerNFTilityToken =
        await ContractFactory.specialDayOwnerNFTilityToken(
          Contract,
          element._year,
          element._month,
          element._day
        )
      if (specialDayOwnerUSDT !== 0 && specialDayOwnerNFTilityToken !== 0) {
        setState((draft) => {
          draft.specialDays.push(element)
        })
      }
    }
  }
  useMemo(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const Withdrew = async (date) => {
    await ContractFactory.withdrewSpecialDayAmount(
      date.year,
      date.month,
      date.day,
      Contract
    )
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Withdrew Special Day Amount
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {state.specialDays.map((date, index) => (
                        <div key={index} className="shadow sm:rounded-md">
                          <div className="px-4 py-5 bg-white sm:p-6">
                            <p className="pb-4">
                              {date._month.toString()}/{date._day.toString()}/
                              {date._year.toString()}
                            </p>
                            <button
                              onClick={() =>
                                Withdrew({
                                  year: date._year.toString(),
                                  month: date._month.toString(),
                                  day: date._day.toString(),
                                })
                              }
                              className="text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600  hover:bg-indigo-700 cursor-pointer"
                            >
                              Withdrew
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
