/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useMemo } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { useForm } from "react-hook-form"
import { doc, updateDoc } from "firebase/firestore"
import { db, storage } from "../../../DB/firebase-config"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"

async function uploadImg({ name, fileName, file }) {
  return new Promise((resolve, reject) => {
    console.log("Uploading image ...")

    const storageRef = ref(storage, `Food/${name}/${fileName}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        console.log("Upload is " + progress + "% done")
      },
      (error) => {
        console.error(error)
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((imgURL) => {
          console.log(`uploaded image:`, imgURL)
          resolve(imgURL)
        })
      }
    )
  })
}

export default function UpdateForm({ data, open, setOpen, setState }) {
  const { register, reset, handleSubmit } = useForm({
    defaultValues: useMemo(() => {
      return data
    }, [data]),
  })

  useMemo(() => {
    reset(data)
  }, [data])

  const onSubmit = async (e) => {
    try {
      let img
      if (typeof e.image[0] === "object") {
        const file = e.image[0]
        const name = e.name
        const fileName = file.name
        img = await uploadImg({ name, fileName, file })
      } else {
        img = data.image
      }

      const myObj = {
        name: e.name,
        price: e.price,
        description: e.description,
        image: img,
      }

      await updateDoc(doc(db, "foodMenu", data.id), myObj)
      setState((e) => {
        e.food[data.index] = {
          id: data.id,
          ...myObj,
        }
      })
      setOpen(false)
    } catch (error) {
      console.error(error)
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
                        Food
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="absolute inset-0 px-4 sm:px-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <input
                            type="text"
                            placeholder="Name"
                            className="w-full py-2.5 px-3 border mb-4 rounded-md "
                            {...register("name", {
                              required: true,
                            })}
                          />

                          <input
                            type="text"
                            placeholder="Price"
                            className="w-full py-2.5 px-3 border mb-4 rounded-md "
                            {...register("price", {
                              required: true,
                            })}
                          />

                          <input
                            type="file"
                            className="w-full px-3 border mb-4 rounded-md "
                            {...register("image", {})}
                          />

                          <textarea
                            placeholder="description"
                            className="w-full py-2.5 px-3 border mb-4 rounded-md "
                            {...register("description", {})}
                          />

                          <input
                            className=" cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            type="submit"
                          />
                        </form>
                      </div>
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
