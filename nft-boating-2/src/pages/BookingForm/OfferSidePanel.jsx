/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useForm } from "react-hook-form"
import { useWeb3React } from "@web3-react/core"
import { useContextAPI } from "../../ContextAPI"
import { useNavigate } from "react-router-dom"

import { useImmer } from "use-immer"
import { parseEther, parseUnits } from "ethers/lib/utils"

export default function OfferSidePanel({
  open,
  setOpen,
  errordate,
  id,
  Contract,
}) {
  const navigate = useNavigate()
  const { active } = useWeb3React()
  const { ContractFactory, FactoryAddress, ContractUSDT } = useContextAPI()

  const [state, setState] = useImmer({
    bookedID: null,
  })

  useEffect(() => {
    if (active) {
      const run = async () => {
        let BookDateID
        try {
          BookDateID = await ContractFactory._bookDateID(
            Contract,
            errordate.year,
            errordate.month,
            errordate.day
          )
        } catch (e) {
          console.log(e)
        }

        setState((e) => {
          e.bookedID = BookDateID.toString()
        })
      }
      run()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const amount = watch("amount")

  const Submit = async (data) => {
    try {
      console.log(Contract, state.bookedID, id, parseEther(data.amount))
      const tx = await ContractFactory.offer(
        Contract,
        state.bookedID,
        id,
        parseUnits(data.amount.toString(), 6)
      )
      await tx.wait()
      setOpen(false)
      navigate(`/collected`)
    } catch (e) {
      console.error(e)
    }
  }
  console.log(errors)

  const [button, setButton] = useState(true)

  const handleApprove = async (e) => {
    console.log(
      "handleApprove run",
      FactoryAddress,
      parseUnits(amount.toString(), 6)
    )
    try {
      const tx = await ContractUSDT.approve(
        FactoryAddress,
        parseUnits(amount.toString(), 6)
      )
      await tx.wait()
      setButton(false)
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
                        {errordate.day}-{errordate.month}-{errordate.year}
                      </Dialog.Title>
                      <p className="text-red-900">
                        This date is already booked , You can still book this
                        Date by offering more then 300 USDT
                      </p>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <form onSubmit={handleSubmit(Submit)}>
                        <div className="shadow sm:rounded-md">
                          <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="grid grid-cols-6 gap-4">
                              <div className="col-span-6 sm:col-span-6">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Amount
                                </label>
                                <input
                                  type="text"
                                  placeholder="amount"
                                  className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                  {...register("amount", {
                                    required: true,
                                  })}
                                />
                              </div>
                              {/* <div className="col-span-6 sm:col-span-6">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Select Your Nft
                                </label>
                                <select
                                  className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                  {...register("userID", {
                                    required: true,
                                  })}
                                >
                                  {state.data.map((item) => {
                                    return (
                                      <>
                                        <option
                                          className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                          value={item.nftNumber}
                                        >
                                          {item.nftNumber}
                                        </option>
                                      </>
                                    )
                                  })}
                                </select>
                              </div> */}

                              <div className="col-span-6 sm:col-span-3">
                                <span
                                  onClick={handleApprove}
                                  className={
                                    "text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 " +
                                    (button
                                      ? "bg-indigo-600  hover:bg-indigo-700 cursor-pointer"
                                      : "bg-gray-600 opacity-50 cursor-not-allowed")
                                  }
                                >
                                  Approve
                                </span>
                              </div>
                              <div className="col-span-6 sm:col-span-3">
                                <button
                                  className={
                                    "text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 " +
                                    (button
                                      ? "bg-gray-600 opacity-50 cursor-not-allowed"
                                      : "bg-indigo-600  hover:bg-indigo-700 cursor-pointer")
                                  }
                                  type="submit"
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
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
