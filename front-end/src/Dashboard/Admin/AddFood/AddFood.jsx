import { PencilIcon } from "@heroicons/react/solid"
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useImmer } from "use-immer"
import { db } from "../../../DB/firebase-config"
import Form from "./Form"
import UpdateForm from "./updateForm"

export default function AddFood() {
  const [open, setOpen] = useState(false)
  const [openUpdateForm, setOpenUpdateForm] = useState(false)
  const [state, setState] = useImmer({ food: [], data: {} })
  console.log(state)

  async function allFoodDocs() {
    try {
      const querySnapshot = await getDocs(collection(db, "foodMenu"))
      querySnapshot.forEach((doc) => {
        setState((e) => {
          e.food.push({ id: doc.id, ...doc.data() })
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log("<<<<<<<<<<<<")
    allFoodDocs()
  }, [])

  function openUpdateFormFunction(food) {
    setState((e) => {
      e.data = food
    })

    setOpenUpdateForm(true)
  }

  async function deleteDocFunction(food) {
    await deleteDoc(doc(db, "foodMenu", food.id))

    setState((e) => {
      e.food.splice(food.index, 1)
    })
  }

  return (
    <>
      <Form open={open} setOpen={setOpen} setState={setState} />
      <UpdateForm
        open={openUpdateForm}
        setOpen={setOpenUpdateForm}
        data={state.data}
        setState={setState}
      />

      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8 md:flex md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Food</h1>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" aria-hidden="true" />
              Add
            </button>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              <ul role="list" className="-my-6 divide-y divide-gray-200">
                {state.food &&
                  state.food.map((food, index) => {
                    const { id, name, price, image, description } = food

                    return (
                      <li key={id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img src={image} className="h-full w-full object-cover object-center" />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{name}</h3>
                              <p className="ml-4">$ {price}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{description}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div></div>
                            <div className="flex">
                              <button
                                onClick={() => openUpdateFormFunction({ ...food, index })}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => deleteDocFunction({ ...food, index })}
                                className="inline-flex items-center px-4 ml-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
              </ul>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  )
}
