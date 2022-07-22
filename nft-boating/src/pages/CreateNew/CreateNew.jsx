import { useForm } from "react-hook-form"
import { useContextAPI } from "./../../ContextAPI"
import { useWeb3React } from "@web3-react/core"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, signInWithGoogle } from "../../DB/firebase-config"

export default function CreateNew() {
  const [user, loading, error] = useAuthState(auth)

  const { account, active } = useWeb3React()
  const { ContractFactory } = useContextAPI()
  const navigate = useNavigate()

  const [State, SetState] = useImmer({
    SetBtnDisable: false,
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const image = watch("images")

  const onSubmit = async (data) => {
    console.log({ data })

    SetState((draft) => {
      draft.SetBtnDisable = true
    })

    try {
      await ContractFactory.deploy(
        data.name_,
        data.symbol_,
        data.totalSupply_,
        data.price_,
        account,
        data.baseURI_
      )
    } catch (e) {
      console.log(">>>>>>>>>>>>>>", e)
      SetState((draft) => {
        draft.SetBtnDisable = false
      })
    }

    ContractFactory.on("deploy_", (_Contract) => {
      navigate(`/contract/${_Contract}`)
    })
  }
  console.log(errors)

  return (
    <div className="CreateNew min-h-full">
      <header className="bg-white">
        <div className="mt-20 mb-20 text-center">
          <h1 className="mb-1 font-bold text-5xl "> Create New </h1>
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
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            placeholder="Name"
                            {...register("name_", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Symbol
                          </label>
                          <input
                            type="text"
                            placeholder="Symbol"
                            {...register("symbol_", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Total Supply
                          </label>
                          <input
                            type="number"
                            placeholder="Total Supply"
                            {...register("totalSupply_", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Price (USDT)
                          </label>
                          <input
                            type="number"
                            placeholder="Price"
                            {...register("price_", {
                              required: true,
                              minLength: 1,
                              maxLength: 100,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Owner Address
                          </label>
                          <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                            {account}
                          </p>
                          {/* <input
                            type="text"
                            // value={accountWalletAddress}
                            // onChange={}
                            // value ={account}
                            placeholder="0x0000000000000000000000000000000000000000"
                            {...register("ownerAddress_", {
                              value: accountWalletAddress || account,
                              required: true,
                              onChange: (e) =>
                                setAccountWalletAddress(e.target.value),
                              maxLength: 100,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          /> */}
                        </div>

                        <div className="col-span-6 sm:col-span-6 mb-3">
                          <label
                            htmlFor="company-website"
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
                              placeholder="Qmxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              {...register("baseURI_", {
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
                              onClick={() =>
                                window.open(
                                  "https://www.pinata.cloud/",
                                  "_blank"
                                )
                              }
                            >
                              Pinata
                            </a>
                          </p>
                        </div>

                        {console.log(image)}

                        <div className="col-span-6 sm:col-span-6 mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Boat Images
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
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
                                    // name="file-upload"
                                    multiple
                                    {...register("images", {
                                      // value: accountWalletAddress || account,
                                      // required: true,
                                      // onChange: (e) =>
                                      //   setAccountWalletAddress(e.target.value),
                                      // maxLength: 100,
                                    })}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          {!user ? (
                            <span
                              onClick={signInWithGoogle}
                              className=" cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                              </svg>
                              Sign in to Gmail To run This Function
                            </span>
                          ) : (
                            <button
                              className=" cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              type="submit"
                              disabled={State.btnDisable}
                            >
                              Create
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
