import { ethers } from "ethers"
import { useEffect, useMemo, useState } from "react"
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
  const {
    ContractDeploy,
    ContractUSDT,
    ContractFactory,
    FactoryAddress,
    ContractNFTilityToken,
    ContractNFTilityExchange,
  } = useContextAPI()
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const [user] = useAuthState(auth)

  // const ContractNFTYacht = new ethers.Contract(Contract, NFTYacht, provider)
  const { register, handleSubmit, watch } = useForm()

  const [State, SetState] = useImmer({
    id: 0,
    name: "Name",
    symbol: "X",
    tSupply: 0.0,
    tOwnership: 0.0,
    priceUSDT: 0.0,
    priceNNT: 0.0,
    owner: "0x0000000000000000000000000000000000000000",
    baseURI: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",

    userBalance: "0.0",
    approveIsLoading: false,
    confirmIsLoading: false,
    userHaveBalance: false,
  })

  useEffect(() => {
    const run = async () => {
      if (active) {
        let ContractInfo
        try {
          ContractInfo = await ContractDeploy.contractDitals(Contract)
        } catch (e) {
          console.error(e)
        }

        let ExchangeRate
        try {
          ExchangeRate =
            await ContractNFTilityExchange.priceCalculatorUSDTtoNNT(
              ContractInfo.price.toString()
            )
        } catch (e) {
          console.error(e)
        }

        const id = ContractInfo.id.toString()
        const name = ContractInfo.name.toString()
        const symbol = ContractInfo.symbol.toString()
        const tSupply = ContractInfo.tSupply.toString()
        const tOwnership = ContractInfo.tOwnership.toString()
        const priceUSDT = formatUnits(ContractInfo.price.toString(), 6)

        const priceNNT = formatUnits(ExchangeRate.toString(), 18)
        const owner = ContractInfo.owner.toString()
        const baseURI = ContractInfo.baseURI.toString()

        SetState((draft) => {
          draft.id = id
          draft.name = name
          draft.symbol = symbol
          draft.tSupply = tSupply
          draft.tOwnership = tOwnership
          draft.priceUSDT = priceUSDT
          draft.priceNNT = priceNNT
          draft.owner = owner
          draft.baseURI = baseURI
        })
      }
    }
    run()
  }, [Contract, account])

  const selectedToken = async (Token) => {
    if (Token === "USDT") {
      console.log(Token)

      if (active) {
        try {
          const userBalance = await ContractUSDT.balanceOf(account)

          SetState((draft) => {
            draft.userBalance = formatUnits(userBalance.toString(), 6)
          })
        } catch (e) {
          console.log(e)
        }
      }
    } else if (Token === "NNT") {
      console.log(Token)

      if (active) {
        try {
          const userBalance = await ContractNFTilityToken.balanceOf(account)

          SetState((draft) => {
            draft.userBalance = formatUnits(userBalance.toString(), 18)
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
  }

  const totalMint = watch("totalMint")
  const selectToken = watch("selectToken")

  useMemo(() => selectedToken(selectToken), [selectToken, account])

  const [state, setSate] = useState(true)

  const handleApprove = async () => {
    if (state) {
      SetState((draft) => {
        draft.approveIsLoading = true
      })

      if (selectToken === "USDT") {
        const value = totalMint * State.priceUSDT
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
      } else if (selectToken === "NNT") {
        const value = totalMint * State.priceNNT
        try {
          const tx = await ContractNFTilityToken.approve(
            FactoryAddress,
            parseUnits(value.toString(), 18)
          )
          await tx.wait()
          setSate(false)
        } catch (e) {
          console.error(e)
        }
      }

      SetState((draft) => {
        draft.approveIsLoading = false
      })
    }
  }

  const onSubmit = async (data) => {
    console.log(data)
    SetState((draft) => {
      draft.confirmIsLoading = true
    })

    if (selectToken === "USDT") {
      const value = totalMint * State.priceUSDT

      try {
        const tx = await ContractFactory.buyOwnership(
          totalMint,
          0,
          parseUnits(value.toString(), 6),
          Contract
        )

        await tx.wait()

        navigate(`/your-nfts`)
      } catch (e) {
        console.error(e)
      }
    } else if (selectToken === "NNT") {
      const value = totalMint * State.priceNNT

      try {
        const tx = await ContractFactory.buyOwnership(
          totalMint,
          1,
          parseUnits(value.toString(), 18),
          Contract
        )

        await tx.wait()

        navigate(`/your-nfts`)
      } catch (e) {
        console.error(e)
      }
    }

    SetState((draft) => {
      draft.confirmIsLoading = true
    })
  }

  useMemo(() => {
    if (selectToken === "USDT") {
      if (
        Number(totalMint * State.priceUSDT) <= Number(State.userBalance) &&
        Number(State.userBalance) > 0
      ) {
        SetState((draft) => {
          draft.userHaveBalance = true
        })
      } else {
        SetState((draft) => {
          draft.userHaveBalance = false
        })
      }
    } else {
      if (Number(totalMint * State.priceNNT) <= Number(State.userBalance)) {
        console.log("totalMint useMemo 2")
        SetState((draft) => {
          draft.userHaveBalance = true
        })
      } else {
        SetState((draft) => {
          draft.userHaveBalance = false
        })
      }
    }
  }, [totalMint, selectToken, account])

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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                        Your {selectToken} Balance
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        {State.userBalance}
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chose token:
                      </label>
                      <select
                        className="w-full py-2.5 px-3 border mb-4 rounded-md"
                        {...register("selectToken", { required: true })}
                      >
                        <option value="USDT">USDT ( TetherToken )</option>
                        <option value="NNT">NNT ( NFTility Token )</option>
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Price of 1 Token in {selectToken}:
                        <span>
                          {selectToken === "USDT"
                            ? State.priceUSDT
                            : State.priceNNT}
                        </span>
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        {selectToken} :{" "}
                        <span>
                          {selectToken === "USDT"
                            ? State.priceUSDT
                              ? totalMint * State.priceUSDT
                              : 0.0
                            : State.priceNNT
                            ? totalMint * State.priceNNT
                            : 0.0}
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
                        {State.userHaveBalance ? (
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
                        ) : (
                          <p className="col-span-6 text-center bg-red-700 text-white">
                            You don't have balance
                          </p>
                        )}
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
