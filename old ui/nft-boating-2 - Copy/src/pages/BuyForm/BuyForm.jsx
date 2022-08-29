import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useImmer } from "use-immer"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { useContextAPI } from "./../../ContextAPI"
import { useWeb3React } from "@web3-react/core"
import { formatUnits, parseEther, parseUnits } from "ethers/lib/utils"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, signInWithGoogle } from "../../DB/firebase-config"

export default function BuyForm() {
  const { Contract } = useParams()
  const { ContractDeploy, ContractUSDT, ContractFactory, FactoryAddress } =
    useContextAPI()
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const [user, loading, error] = useAuthState(auth)

  // const ContractNFTYacht = new ethers.Contract(Contract, NFTYacht, provider)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [State, SetState] = useImmer({
    isLoading: true,
    id: 0,
    name: "Name",
    symbol: "X",
    tSupply: 0.0,
    tOwnership: 0.0,
    price: 0.0,
    owner: "0x0000000000000000000000000000000000000000",
    baseURI: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",

    userBalance: "0.0",
    approveIsLoading: false,
    confirmIsLoading: false,
  })

  useEffect(() => {
    const run = async () => {
      try {
        const ContractInfo = await ContractDeploy.contractDitals(Contract)
        console.log(">>>>>>>")
        console.log({ ContractInfo })

        // uint id, string memory name, string memory symbol, uint tSupply,
        // uint tOwnership, uint price, address owner, string memory baseURI

        const id = ContractInfo.id.toString()
        const name = ContractInfo.name.toString()
        const symbol = ContractInfo.symbol.toString()
        const tSupply = ContractInfo.tSupply.toString()
        const tOwnership = ContractInfo.tOwnership.toString()
        const price = formatUnits(ContractInfo.price.toString(), 6)
        const owner = ContractInfo.owner.toString()
        const baseURI = ContractInfo.baseURI.toString()

        SetState((draft) => {
          draft.id = id
          draft.name = name
          draft.symbol = symbol
          draft.tSupply = tSupply
          draft.tOwnership = tOwnership
          draft.price = price
          draft.owner = owner
          draft.baseURI = baseURI

          draft.isLoading = false
        })
      } catch (e) {
        console.log(e)
      }
    }
    run()
  }, [Contract])

  useEffect(() => {
    if (active) {
      const run = async () => {
        console.log(account)
        try {
          const userBalance = await ContractUSDT.balanceOf(account)

          SetState((draft) => {
            draft.userBalance = formatUnits(userBalance.toString(), 6)
          })
        } catch (e) {
          console.log(e)
        }
      }
      run()
    }
  }, [active])

  const totalMint = watch("totalMint")

  const [state, setSate] = useState(true)

  const handleApprove = async () => {
    if (state) {
      SetState((draft) => {
        draft.approveIsLoading = true
      })
      const value = totalMint * State.price
      try {
        const tx = await ContractUSDT.approve(
          FactoryAddress,
          parseUnits(value.toString(), 6)
        )
        await tx.wait()
        setSate(false)
      } catch (e) {
        console.error(e)
      }
      SetState((draft) => {
        draft.approveIsLoading = false
      })
    }
  }

  const onSubmit = async (data) => {
    SetState((draft) => {
      draft.confirmIsLoading = true
    })

    const value = totalMint * State.price
    console.log("Submit", totalMint, value)

    try {
      const tx = await ContractFactory.buyOwnership(
        totalMint,
        parseUnits(value.toString(), 6),
        Contract
      )

      await tx.wait()

      navigate(`/collected`)
    } catch (e) {
      console.error(e)

      SetState((draft) => {
        draft.approveIsLoading = false
      })
    }

    SetState((draft) => {
      draft.approveIsLoading = false
    })
  }
  console.log(errors)

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="mb-20 text-center">
        <h1 className="mb-1 font-bold text-5xl "> Buy MemberShips</h1>
        <div className="max-w-3xl mx-auto text-center">
          Buy an NFT for membership of your desired vessel. Choose the date of
          your trip and your ride will be waiting for you...
        </div>
      </div>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                MemberShips
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Ownership of a member NFT entitles you to one chartered day on
                your chosen boat throughout the year. You can reserve your slot
                within 60 days from the date of selection and your ride will be
                ready for you on that particular date. Memberships remain valid
                for upto 10 years from the date of purchase so there's no risk
                of lost dates or change of plans. Go ahead and become a
                member...
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={State.isLoading ? "animate-pulse" : ""}
            >
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-6 sm:col-span-6">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Wallet Address :
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        {account
                          ? account
                          : "0x0000000000000000000000000000000000000000"}
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supply
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        {State.tOwnership}/{State.tSupply}
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your USDT Balance
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        {State.userBalance}
                      </p>
                    </div>

                    <div></div>

                    <div className="col-span-6 sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Price of 1 Token in USDT:
                        <span> {State.price}</span>
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        USDT :{" "}
                        <span>
                          {State.price ? totalMint * State.price : 0.0}
                        </span>
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-6">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Buy membership
                      </label>
                      <input
                        type="number"
                        placeholder="Buy membership"
                        min={1}
                        max={10}
                        {...register("totalMint", {
                          required: true,
                          max: 10,
                          min: 1,
                        })}
                        className="w-full py-2.5 px-3 border mb-4 rounded-md "
                      />
                    </div>
                    {!user ? (
                      <div className="col-span-6 sm:col-span-6">
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
                      </div>
                    ) : (
                      <>
                        <div className="col-span-6 sm:col-span-3">
                          <span
                            onClick={handleApprove}
                            className={
                              "text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 " +
                              (state
                                ? "bg-indigo-600  hover:bg-indigo-700 cursor-pointer"
                                : "bg-gray-600 opacity-50 cursor-not-allowed")
                            }
                          >
                            {/* <svg
                              className="animate-spin h-5 w-5 mr-3 text-white"
                              viewBox="0 0 24 24"
                            >
                              A
                            </svg> */}
                            {State.approveIsLoading && (
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
                            Approve
                          </span>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <button
                            className={
                              "text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 " +
                              (state
                                ? "bg-gray-600 opacity-50 cursor-not-allowed"
                                : "bg-indigo-600  hover:bg-indigo-700 cursor-pointer")
                            }
                            type="submit"
                          >
                            {State.confirmIsLoading && (
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
                            Confirm
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
