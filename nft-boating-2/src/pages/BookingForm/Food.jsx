/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useContext, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useForm } from "react-hook-form"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../DB/firebase-config"
import { useImmer } from "use-immer"
import DispatchContext from "../../DispatchContext"

export default function Food({ setOpen, open, setState, state }) {
  const appDispatch = useContext(DispatchContext)

  const [stateFood, setFoodState] = useImmer({
    food: [],
    isLoding: true,
  })

  useEffect(() => {
    const run = async () => {
      setFoodState((d) => {
        d.food = []
        d.isLoding = true
      })

      const querySnapshot = await getDocs(collection(db, "foodMenu"))
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data())

        const food = {
          id: doc.id,
          data: doc.data(),
        }

        setFoodState((d) => {
          d.food.push(food)
          d.isLoding = false
        })
      })
    }
    run()
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  // const food = watch(["food"])
  // console.log(food, ">>>>>>>>>>>>")

  const onFoodSubmit = (data) => {
    let foodArray = []
    for (const key in data) {
      if (data[key]) {
        console.log(`${key}: ${data[key]}`)
        foodArray.push(key)
      }
    }

    let foodArray2 = []
    let totalPrice = 0
    for (let i = 0; i < foodArray.length; i++) {
      for (let j = 0; j < stateFood.food.length; j++) {
        if (foodArray[i] == stateFood.food[j].id) {
          let foodNameAndDescription = {
            name: stateFood.food[j].data.name,
            description: stateFood.food[j].data.description,
          }
          foodArray2.push(foodNameAndDescription)
          totalPrice += Number(stateFood.food[j].data.price)
        }
      }
    }

    appDispatch({
      type: "food",
      value: { array: foodArray2, total: totalPrice },
    })
    setOpen(false)
  }
  console.log(errors)

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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    onSubmit={handleSubmit(onFoodSubmit)}
                    className="flex h-full flex-col bg-white shadow-xl"
                  >
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Pick Your Food
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {stateFood.food.map((product, index) => (
                              <li key={index} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.data.image}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>{product.data.name}</h3>
                                      <p className="ml-4">
                                        $ {product.data.price}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {product.data.description}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      {/* Qty {product.quantity} */}
                                    </p>

                                    <div className="flex">
                                      <label htmlFor={product.data.name}>
                                        <input
                                          type="checkbox"
                                          id={product.data.name}
                                          {...register(product.id, {})}
                                        />{" "}
                                        Select
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      {/* <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>USDT 262.00</p>
                      </div> */}
                      <p className="mt-0.5 text-sm text-gray-500">
                        You have to pay amount before your ride
                      </p>
                      <div className="mt-6">
                        {/* <button
                          type="button"
                          className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          onClick={() => setOpen(false)}
                        >
                          Continue
                        </button> */}
                        <input
                          className="cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          type="submit"
                          value="Continue"
                        />
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
