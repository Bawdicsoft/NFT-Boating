/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useForm } from "react-hook-form"
import { useContextAPI } from "../../../ContextAPI"
import { parseUnits } from "ethers/lib/utils"
import UpdatePrice from "./UpdatePrice"

export default function UpdateContract({ open, setOpen, Contract }) {
  const { ContractFactory } = useContextAPI()
  const { register, handleSubmit } = useForm()

  const Submit = async (data) => {
    try {
      const tx = await ContractFactory.addSpecialDay(
        data.Year,
        data.Month,
        data.Day,
        parseUnits(data.Amount.toString(), 6).toString(),
        Contract
      )
      await tx.wait()
      setOpen(false)
    } catch (e) {
      console.error(e)
    }
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
                        Update Contract
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <form onSubmit={handleSubmit(Submit)}>
                        <div className="shadow sm:rounded-md">
                          <div className="px-4 py-5 bg-white sm:p-6">
                            <h2 className="py-2">Add Special Day</h2>
                            <div className="grid grid-cols-6 gap-4">
                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Year:
                                </label>
                                <input
                                  className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                  type="text"
                                  placeholder="Year"
                                  {...register("Year", {
                                    required: true,
                                  })}
                                />
                              </div>

                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Month:
                                </label>
                                <input
                                  className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                  type="text"
                                  placeholder="Month"
                                  {...register("Month", {
                                    required: true,
                                  })}
                                />
                              </div>

                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Day:
                                </label>
                                <input
                                  className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                  type="text"
                                  placeholder="Day"
                                  {...register("Day", {
                                    required: true,
                                  })}
                                />
                              </div>

                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Amount:
                                </label>
                                <input
                                  className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                  type="text"
                                  placeholder="Amount"
                                  {...register("Amount", {
                                    required: true,
                                  })}
                                />
                              </div>

                              <div className="col-span-6">
                                <button
                                  className="text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600  hover:bg-indigo-700 cursor-pointer"
                                  type="submit"
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                      <UpdatePrice Contract={Contract} setOpen={setOpen} />
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
