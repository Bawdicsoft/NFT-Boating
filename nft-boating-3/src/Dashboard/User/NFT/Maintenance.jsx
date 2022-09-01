/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useMemo, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useForm } from "react-hook-form"
import { useWeb3React } from "@web3-react/core"
import { useContextAPI } from "../../../ContextAPI"
import { useImmer } from "use-immer"
import { formatUnits, parseUnits } from "ethers/lib/utils"

export default function Maintenance({ open, setOpen, Contract, id }) {
  const { account, active, activate } = useWeb3React()
  const {
    ContractUSDT,
    FactoryAddress,
    ContractFactory,
    ContractNFTilityToken,
    ContractNFTilityExchange,
  } = useContextAPI()

  const [button, setButton] = useState(true)
  const [state, setState] = useImmer({
    userBalance: "00",
    maintenanceFeeUSDT: "00",
    maintenanceFeeNNT: "00",
    approveIsLoading: false,
  })

  const fetch = async () => {
    const maintenanceFeeUSDT = await ContractFactory._maintenanceFee()
    console.log(formatUnits(maintenanceFeeUSDT.toString(), 6))
    setState((draft) => {
      draft.maintenanceFeeUSDT = formatUnits(maintenanceFeeUSDT.toString(), 6)
    })

    const maintenanceFeeNNT =
      await ContractNFTilityExchange.priceCalculatorUSDTtoNNT(
        maintenanceFeeUSDT.toString()
      )
    console.log(formatUnits(maintenanceFeeNNT.toString(), 18))
    setState((draft) => {
      draft.maintenanceFeeNNT = formatUnits(maintenanceFeeNNT.toString(), 18)
    })
  }

  useMemo(() => {
    if (active) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const selectToken = watch("selectToken")

  const selectedToken = async (Token) => {
    if (Token === "USDT") {
      console.log(Token)

      if (active) {
        try {
          const userBalance = await ContractUSDT.balanceOf(account)

          setState((draft) => {
            draft.userBalance = formatUnits(userBalance.toString(), 6)
          })
        } catch (e) {
          console.log(e)
        }
      }
    } else if (Token === "NNT") {
      console.log(Token)

      if (active) {
        try {
          const userBalance = await ContractNFTilityToken.balanceOf(account)

          setState((draft) => {
            draft.userBalance = formatUnits(userBalance.toString(), 18)
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
  useMemo(() => selectedToken(selectToken), [selectToken])

  const Submit = async (data) => {
    console.log(data)
    if (selectToken === "USDT") {
      try {
        const tx = await ContractFactory.payMaintenanceFee(
          Contract,
          id,
          0,
          parseUnits(state.maintenanceFeeUSDT.toString(), 6).toString()
        )
        await tx.wait()
        setOpen(false)
      } catch (e) {
        console.error(e)
      }
    } else if (selectToken === "NNT") {
      try {
        const tx = await ContractFactory.payMaintenanceFee(
          Contract,
          id,
          1,
          parseUnits(state.maintenanceFeeUSDT.toString(), 18).toString()
        )
        await tx.wait()
        setOpen(false)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleApprove = async () => {
    if (state) {
      setState((draft) => {
        draft.approveIsLoading = true
      })

      if (selectToken === "USDT") {
        try {
          const tx = await ContractUSDT.approve(
            FactoryAddress,
            parseUnits(state.maintenanceFeeUSDT.toString(), 6)
          )
          await tx.wait()
          setState((draft) => {
            draft.approveIsLoading = false
          })
        } catch (e) {
          console.error(e)
        }
      } else if (selectToken === "NNT") {
        try {
          const tx = await ContractNFTilityToken.approve(
            FactoryAddress,
            parseUnits(state.maintenanceFeeNNT.toString(), 18)
          )
          await tx.wait()
          setState((draft) => {
            draft.approveIsLoading = false
          })
          setButton(false)
        } catch (e) {
          console.error(e)
        }
      }

      setState((draft) => {
        draft.approveIsLoading = false
      })
      setButton(false)
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
                        Panel title
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <form onSubmit={handleSubmit(Submit)}>
                        <div className="shadow sm:rounded-md">
                          <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="grid grid-cols-6 gap-4">
                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Chose token:
                                </label>
                                <select
                                  className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                  {...register("selectToken", {
                                    required: true,
                                  })}
                                >
                                  <option value="USDT">
                                    USDT ( TetherToken )
                                  </option>
                                  <option value="NNT">
                                    NNT ( NFTility Token )
                                  </option>
                                </select>
                              </div>

                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Your balance in {selectToken}
                                </label>
                                <p className="w-full py-2.5 px-3 border mb-2 rounded-md">
                                  <span>{state.userBalance}</span>
                                </p>
                              </div>

                              <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Maintenance Fee {selectToken}
                                </label>
                                <p className="w-full py-2.5 px-3 border mb-2 rounded-md">
                                  <span>
                                    {selectToken == "USDT"
                                      ? state.maintenanceFeeUSDT
                                      : state.maintenanceFeeNNT}
                                  </span>
                                </p>
                              </div>

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
                                    "text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 " + // (button
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
                      {/* /End replace */}
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
