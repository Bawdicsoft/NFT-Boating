import { useForm } from "react-hook-form"
import { useImmer } from "use-immer"
import { collection, addDoc } from "firebase/firestore"
import axios from "axios"
// import { useNavigate } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { db, storage } from "../../DB/firebase-config"
import { useContextAPI } from "../../ContextAPI"
import { useEffect, useState } from "react"
import { async } from "@firebase/util"
import Popup from "./Popup"

export default function ListBoat() {
  const { updateDocRequests, UserData } = useContextAPI()
  console.log(UserData.email, "UserData")
  const { account } = useWeb3React()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [state, setState] = useImmer({
    btnLoading: false,
    progresspercent: 0,
    popup: false,
  })

  const [open, setOpen] = useState(false)

  const onSubmit = async (e) => {
    setOpen(true)
    setState((draft) => {
      draft.btnLoading = true
    })

    const file = e.featuredImage[0]

    if (!file) return

    const storageRef = ref(storage, `files/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setState((e) => {
          e.progresspercent = progress
        })
      },
      (error) => {
        alert(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((featuredImageURL) => {
          console.log(featuredImageURL)

          const file = e.coverImage[0]

          if (!file) return

          const storageRef = ref(storage, `files/${file.name}`)
          const uploadTask = uploadBytesResumable(storageRef, file)

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              )
              setState((e) => {
                e.progresspercent = progress
              })
            },
            (error) => {
              alert(error)
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (coverImageURL) => {
                  console.log(coverImageURL)

                  const request = {
                    featuredImage: featuredImageURL,
                    coverImage: coverImageURL,
                    name: e.name,
                    phone: e.phone,
                    year: e.year,
                    make: e.make,
                    model: e.model,
                    price: e.price,
                    location: e.location,
                    walletAddress: account,
                    description: e.description,
                  }

                  console.log(">>>>>>>>>", request)

                  try {
                    await addDoc(collection(db, "Requst"), {
                      request,
                    })
                  } catch (error) {
                    console.log(error)
                  }
                  console.log("host>>>>>>>>>>>")

                  try {
                    await updateDocRequests("users", {
                      request,
                      host: true,
                    })
                  } catch (error) {
                    console.log(error)
                  }

                  const Mail = {
                    fromName: "NFT Boating",
                    from: "nabeelatdappvert@gmail.com",
                    to: `farooqdaadkhan@gmail.com`,
                    subject: "You have new request from NFT Boation",
                    text: `featuredImage: ${featuredImageURL} \n
                    coverImage: ${coverImageURL} \n
                    name: ${e.name} \n
                    phone: ${e.phone} \n
                    email: ${UserData.email} \n
                    year: ${e.year} \n
                    make: ${e.make} \n
                    model: ${e.model} \n
                    price: ${e.price} \n
                    location: ${e.location} \n
                    walletAddress: ${account} \n
                    description: ${e.description}`,
                  }

                  const res = await axios.post(
                    "http://localhost:8080/email",
                    Mail
                  )
                  console.log(res.data.msg)

                  setState((e) => {
                    e.btnLoading = false
                  })
                  setOpen(false)
                }
              )
            }
          )
        })
      }
    )
  }
  console.log(errors)

  return (
    <div className="CreateNew min-h-full">
      <Popup open={open} setOpen={setOpen} state={state} />
      <header className="bg-white">
        <div className="mt-20 mb-20 text-center">
          <h1 className="mb-1 font-bold text-5xl "> Become a Host </h1>
          <div className="max-w-3xl mx-auto text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque
            ipsa commodi accusamus cupiditate blanditiis nihil voluptas
            architecto numquam, omnis delectus?
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div>
                <h2 className="text-1xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                  Technical Specifications
                </h2>
                <p className="mt-4 text-gray-500">
                  The walnut wood card tray is precision milled to perfectly fit
                  a stack of Focus cards. The powder coated steel divider
                  separates active cards from new ones, or can be used to
                  archive important task lists.
                </p>

                <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-7 lg:gap-x-8">
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">Origin</dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      Designed by Good Goods, Inc.
                    </dd>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">
                      Considerations
                    </dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      Made from natural materials. Grain and color vary with
                      each item.
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="shadow sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            {...register("name", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Phone Number
                          </label>
                          <input
                            type="text"
                            id="phone"
                            placeholder="Phone Number"
                            {...register("phone", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="year"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Year
                          </label>
                          <input
                            type="text"
                            id="year"
                            placeholder="Year"
                            {...register("year", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="make"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Make
                          </label>
                          <input
                            type="text"
                            id="make"
                            placeholder="Make"
                            {...register("make", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="model"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Model
                          </label>
                          <input
                            type="text"
                            id="model"
                            placeholder="Model"
                            {...register("model", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        {/* <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Symbol
                          </label>
                          <input
                            type="text"
                            placeholder="Symbol"
                            {...register("symbol", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div> */}

                        {/* <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Total Supply
                          </label>
                          <input
                            type="number"
                            placeholder="Total Supply"
                            {...register("totalSupply", {
                              required: true,
                              maxLength: 365,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div> */}

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Price (USDT)
                          </label>
                          <input
                            type="number"
                            id="price"
                            placeholder="Price (USDT)"
                            {...register("price", {
                              required: true,
                              minLength: 1,
                            })}
                            className="w-full py-2.5 px-3 border  rounded-md"
                          />
                          <p className="mt-2 text-sm text-gray-500 mb-4">
                            What you wanna charge in (USDT)
                          </p>
                        </div>

                        <div className="col-span-6 ">
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            placeholder="Location"
                            {...register("location", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border rounded-md mb-4"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="account"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Owner Wallet Address
                          </label>
                          <p
                            id="account"
                            className="w-full py-2.5 px-3 border  mb-4 rounded-md"
                          >
                            {account ? (
                              account
                            ) : (
                              <span className="text-red-600">
                                Connect MetaMask
                              </span>
                            )}
                          </p>
                        </div>

                        {/* <div className="col-span-6 sm:col-span-6 mb-3">
                          <label
                            htmlFor="baseURI"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            JSON Base URI CID
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              ipfs://
                            </span>
                            <input
                              type="text"
                              id="baseURI"
                              placeholder="Qmxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              {...register("baseURI", {
                                required: true,
                                maxLength: 100,
                              })}
                              className="w-full py-2.5 px-3 flex-1 block rounded-none rounded-r-md border"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Please get this hash from{" "}
                            <a
                              className="text-blue-600 visited:text-purple-600 ..."
                              href="https://www.pinata.cloud/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Pinata
                            </a>
                          </p>
                        </div> */}

                        {/* <div className="col-span-6 sm:col-span-6 mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Featured image
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    id="file-upload"
                                    multiple
                                    {...register("files", {
                                      required: true,
                                    })}
                                  />
                                </label>
                                <p className="pl-1">Size should be 1x1</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6 sm:col-span-6 mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Cover Image
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    id="file-upload"
                                    multiple
                                    {...register("files", {
                                      required: true,
                                    })}
                                  />
                                </label>
                                <p className="pl-1">Size should be 16x9</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </div> */}

                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="featuredImage"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Featured Image
                          </label>
                          <input
                            type="file"
                            id="featuredImage"
                            {...register("featuredImage", {
                              required: true,
                            })}
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Size should be 1x1 (PNG, JPG up to 10MB)
                          </p>
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="coverImage"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Cover Image
                          </label>
                          <input
                            type="file"
                            id="coverImage"
                            {...register("coverImage", {
                              required: true,
                            })}
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Size should be 16x9 (PNG, JPG up to 10MB)
                          </p>
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Description
                          </label>
                          <textarea
                            placeholder="Description"
                            id="description"
                            {...register("description", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md h-60"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          {/* {state.btnLoading && (
                            <div className="outerbar">
                              <div
                                className="bg-indigo-100 mb-4"
                                style={{ width: `${state.progresspercent}%` }}
                              >
                                {state.progresspercent} %
                              </div>
                            </div>
                          )} */}

                          <button
                            type="submit"
                            className={
                              `cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ` +
                              (state.btnLoading && "cursor-not-allowed")
                            }
                            disabled={state.btnLoading}
                          >
                            {state.btnLoading && (
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            )}
                            Request Submit{state.btnLoading && "ing..."}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {/* {state.imgUrl && (
                  <img src={state.imgUrl} alt="uploaded file" height={200} />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
