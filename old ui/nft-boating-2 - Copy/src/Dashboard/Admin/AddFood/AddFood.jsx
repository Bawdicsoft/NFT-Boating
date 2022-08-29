import { PencilIcon } from "@heroicons/react/solid"
import { useState } from "react"
import Form from "./Form"

export default function AddFood() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Form open={open} setOpen={setOpen} />

      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:px-8 md:flex md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Food</h1>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                aria-hidden="true"
              />
              Add
            </button>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  )
}
