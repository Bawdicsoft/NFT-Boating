import { useForm } from "react-hook-form"
import { useContextAPI } from "./../../ContextAPI"
import { useWeb3React } from "@web3-react/core"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import { Injected } from "./../../Comp/Wallets/Connectors"
import { useEffect } from "react"
import { auth, db } from "../../DB/firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"
import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore"
import { async } from "@firebase/util"

export default function CreateNew() {
  const { account, active, activate } = useWeb3React()
  const [user, error] = useAuthState(auth)
  const { ContractDeploy, UserData, updateDocRequests, fetchUser } =
    useContextAPI()
  const navigate = useNavigate()

  const [State, SetState] = useImmer({
    SetBtnDisable: false,
    haveRequest: null,
    userData: {},
    userImgs: [],
  })

  console.log(State.userData)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const xyz = async () => {
    const docRef = doc(db, "users", UserData.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().request)
      if (docSnap.data().request !== undefined) {
        SetState((d) => {
          d.userData = docSnap.data().request.data
          d.userImgs = docSnap.data().request.imgUrls
          d.haveRequest = true
        })
      } else {
        SetState((d) => {
          d.haveRequest = false
        })
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!")
      SetState((d) => {
        d.haveRequest = false
      })
    }
  }

  useEffect(() => {
    if (UserData === undefined) {
      return
    } else {
      xyz()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (UserData === undefined) {
      return
    } else {
      xyz()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserData])

  const onSubmit = async (data) => {
    console.log({ data })

    SetState((draft) => {
      draft.SetBtnDisable = true
    })

    // deploy smart contract
    try {
      await ContractDeploy.deploy(
        State.userData.name,
        State.userData.symbol,
        State.userData.totalSupply,
        State.userData.price,
        account,
        `ipfs://${State.userData.baseURI}/`
      )
      // await ContractDeploy.deploy(
      //   data.name_,
      //   data.symbol_,
      //   data.totalSupply_,
      //   data.price_,
      //   account,
      //   `ipfs://${data.baseURI_}/`
      // )
    } catch (e) {
      console.log(">>>>>>>>>>>>>>", e)
      SetState((draft) => {
        draft.SetBtnDisable = false
      })
    }

    ContractDeploy.on("deploy_", async (_Contract) => {
      try {
        // set doc in db
        await setDoc(doc(db, "ContractInfo", _Contract), {
          imgUrls: State.userImgs,
          data: State.userData,
        })
      } catch (error) {
        console.log(error)
      }

      try {
        // deleting feld in user collection
        await updateDocRequests("users", { request: deleteField() })
      } catch (error) {
        console.log(error)
      }

      fetchUser()
      navigate(`/contract/${_Contract}`)
    })
  }
  console.log(errors)

  const connectWithMetaMask = async () => {
    await activate(Injected)
  }

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
                {State.haveRequest ? (
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
                            <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                              {State.userData.name}
                            </p>
                            {/* <input
                            type="text"
                            placeholder="Name"
                            {...register("name_", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          /> */}
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Symbol
                            </label>
                            <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                              {State.userData.symbol}
                            </p>
                            {/* <input
                            type="text"
                            placeholder="Symbol"
                            {...register("symbol_", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          /> */}
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Total Supply
                            </label>
                            <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                              {State.userData.totalSupply}
                            </p>
                            {/* <input
                            type="number"
                            placeholder="Total Supply"
                            {...register("totalSupply_", {
                              required: true,
                              maxLength: 365,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          /> */}
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Price (USDT)
                            </label>
                            <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                              {State.userData.price}
                            </p>
                            {/* <input
                            type="number"
                            placeholder="Price"
                            {...register("price_", {
                              required: true,
                              minLength: 1,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          /> */}
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
                              <p className="w-full py-2.5 px-3 flex-1 block rounded-none rounded-r-md border">
                                {State.userData.baseURI}
                              </p>
                              {/* <input
                              type="text"
                              placeholder="Qmxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                              {...register("baseURI_", {
                                required: true,
                                maxLength: 100,
                              })}
                              className="w-full py-2.5 px-3 flex-1 block rounded-none rounded-r-md border"
                            /> */}
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
                          </div>

                          <div className="col-span-6 sm:col-span-6">
                            {!active ? (
                              <span
                                onClick={connectWithMetaMask}
                                className=" cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Connect With MetaMask
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
                ) : (
                  <div className="max-w-sm mx-auto text-center">
                    <h1 className="text-2xl	">You did not submit any request</h1>
                    <p className="mb-3">
                      Please go Become a Host page and submit your request
                    </p>
                    <Link
                      className=" cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      to="/host"
                    >
                      Become a Host
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
