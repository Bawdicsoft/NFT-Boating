/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition, Menu } from "@headlessui/react"
import { BellIcon, XIcon } from "@heroicons/react/outline"
import { LockClosedIcon } from "@heroicons/react/solid"
import { useWeb3React } from "@web3-react/core"
import { Injected, CoinbaseWallet, walletConnect } from "../Wallets/Connectors"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../DB/firebase-config"
import { useContextAPI } from "../../ContextAPI"
import { useImmer } from "use-immer"
import { formatUnits } from "ethers/lib/utils"

export default function WalletSide({ open, setOpen }) {
  const { activate, active, account, deactivate } = useWeb3React()
  const [user] = useAuthState(auth)

  async function connectInjected() {
    try {
      await activate(Injected)
      localStorage.setItem("isWalletConnected", "Injected")
    } catch (error) {
      console.error(error)
    }
  }
  async function connectCoinbaseWallet() {
    try {
      await activate(CoinbaseWallet)
      localStorage.setItem("isWalletConnected", "CoinbaseWallet")
    } catch (error) {
      console.error(error)
    }
  }
  async function connectWalletConnect() {
    try {
      await activate(walletConnect)
      localStorage.setItem("isWalletConnected", "walletConnect")
    } catch (error) {
      console.error(error)
    }
  }
  function DisconnectWallet() {
    try {
      deactivate()
      localStorage.setItem("isWalletConnected", "")
    } catch (error) {
      console.error(error)
    }
  }

  const { ContractUSDT, ContractDeploy } = useContextAPI()

  const [State, SetState] = useImmer({
    userBalance: "loading..",
  })

  useEffect(() => {
    if (active) {
      const run = async () => {
        try {
          const userBalance = await ContractUSDT.balanceOf(account)

          SetState((draft) => {
            draft.userBalance = formatUnits(userBalance.toString(), 6)
          })
        } catch (e) {
          console.error(e)
          SetState((draft) => {
            draft.userBalance = "00"
          })
        }
      }
      run()
    }
  }, [active])

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
                        {" "}
                        {active ? "Wallet Details" : "My wallet"}
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}

                      {!active ? (
                        <div>
                          {/* metamask */}
                          <div className="mt-6 cursor-pointer bg-slate-50 p-3 rounded-md shadow">
                            <div className="flex  justify-between items-center">
                              <div className="flex text-sm items-center">
                                <div className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                  <div className="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ">
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png"
                                      alt="img"
                                    />
                                  </div>
                                </div>
                                <span className="ml-1">MetaMask</span>
                              </div>
                              <button
                                className="cursor-pointer bg-indigo-600 border border-transparent rounded-md px-2 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={connectInjected}
                              >
                                connect
                              </button>
                            </div>
                          </div>

                          {/* coinbase */}
                          <div className="mt-1 cursor-pointer bg-slate-50 p-3 rounded-md shadow">
                            <div className="flex  justify-between items-center">
                              <div className="flex text-sm items-center">
                                <div className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                  <div className="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ">
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src="https://www.pngrepo.com/download/331345/coinbase-v2.png"
                                      alt="CoinBase"
                                    />
                                  </div>
                                </div>
                                <span className="ml-1">CoinBase</span>
                              </div>
                              <button
                                className="cursor-pointer bg-indigo-600 border border-transparent rounded-md px-2 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={connectCoinbaseWallet}
                              >
                                connect
                              </button>
                            </div>
                          </div>

                          {/* connectwallet */}
                          <div className="mt-1 cursor-pointer bg-slate-50 p-3 rounded-md shadow">
                            <div className="flex  justify-between items-center">
                              <div className="flex text-sm items-center">
                                <div className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                  <div className="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ">
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src="https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png"
                                      alt="WalletConnect"
                                    />
                                  </div>
                                </div>
                                <span className="ml-1">WalletConnect</span>
                              </div>
                              <button
                                className="cursor-pointer  bg-indigo-600 border border-transparent rounded-md px-2 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={connectWalletConnect}
                              >
                                connect
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mt-6 cursor-pointer bg-slate-50 p-3 rounded-md shadow">
                            <div className="flex  justify-between items-center">
                              <div className="flex text-sm items-center">
                                <div className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                  <div className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ">
                                    <img
                                      className="h-8 w-8 rounded-full"
                                      src={user?.photoURL}
                                      alt="img"
                                    />
                                  </div>
                                </div>
                                <span className="ml-1">
                                  <div>
                                    {account.slice(0, 5)}...{account.slice(-4)}
                                  </div>
                                </span>
                              </div>
                              <button
                                className="cursor-pointer bg-indigo-600 border border-transparent rounded-md px-2 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={DisconnectWallet}
                              >
                                Disconnect
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 bg-slate-50 p-3 rounded-md shadow">
                            <h2 className="text-center">Total Balance: USDT</h2>
                            <h1 className="text-center font-medium text-2xl">
                              ${State.userBalance}
                            </h1>
                          </div>
                        </>
                      )}
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
