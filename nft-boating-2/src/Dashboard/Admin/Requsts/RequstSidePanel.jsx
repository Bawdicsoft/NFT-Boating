/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useContextAPI } from "../../../ContextAPI"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "../../../DB/firebase-config"
import { useImmer } from "use-immer"

export default function RequstSidePanel({ open, setOpen, state, setState }) {
  const { ContractDeploy } = useContextAPI()

  const [statep, setStatep] = useImmer({
    err: "",
  })

  const addToWhiteList = async () => {
    try {
      await ContractDeploy.addAddressToWhitelist(state.request.walletAddress)
      await deleteDoc(doc(db, "Requst", state.id))
      setState((e) => {
        if (state.index > -1) {
          e.requests.splice(state.index, 1)
        }
      })
      setOpen(false)
    } catch (e) {
      console.log(e.reason)
      if (e.reason === "execution reverted: !whitelist") {
        setStatep((e) => {
          e.err = "Alredy Witelisted"
        })
      }
    }
  }

  const deleteMyDoc = async () => {
    await deleteDoc(doc(db, "Requst", state.id))
    setState((e) => {
      if (state.index > -1) {
        e.requests.splice(state.index, 1)
      }
    })
    setOpen(false)
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
                        {state.request.name}
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <p className="mb-2">Year: {state.request.year}</p>
                      <p className="mb-2">Make: {state.request.make}</p>
                      <p className="mb-2">Model: {state.request.model}</p>
                      <p className="mb-6">
                        Detals: {state.request.description}
                      </p>
                      <br />

                      <p className="mb-2">Featured Image</p>
                      <img
                        src={state.request.featuredImage}
                        width="400"
                        className="mb-4"
                        alt=""
                      ></img>

                      <p className="mb-2">Cover Image</p>
                      <img
                        src={state.request.coverImage}
                        width="400"
                        className="mb-4"
                        alt=""
                      ></img>
                      <div className="pt-6">
                        {Boolean(statep.err !== "") && (
                          <p className="text-red text-center mb-2">
                            {statep.err}
                          </p>
                        )}
                        <button
                          onClick={addToWhiteList}
                          className=" mb-4 cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Add to white List
                        </button>
                        <button
                          onClick={deleteMyDoc}
                          className=" cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                      </div>
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
