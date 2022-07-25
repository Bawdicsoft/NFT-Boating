import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useImmer } from "use-immer"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { useContextAPI } from "./../../ContextAPI"
import { useWeb3React } from "@web3-react/core"
import { formatEther, parseEther } from "ethers/lib/utils"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, signInWithGoogle } from "../../DB/firebase-config"

export default function BuyForm() {
  const { Contract } = useParams()
  const { NFTYacht, provider, ContractUSDT, ContractFactory, FactoryAddress } =
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
    baseURI: "",
    name: "",
    ownerAddress: "",
    price: "0.0",
    symbol: "",
    tOwnership: "0.0",
    tsupply: "0.0",
  })

  useEffect(() => {
    const run = async () => {
      try {
        const ContractInfo = await ContractFactory.getContractInfo(Contract)
        console.log({ ContractInfo })

        const baseURI = ContractInfo.baseURI.toString()
        const name = ContractInfo.name.toString()
        const ownerAddress = ContractInfo.ownerAddress.toString()
        const price = formatEther(ContractInfo.price.toString())
        const symbol = ContractInfo.symbol.toString()
        const tOwnership = ContractInfo.tOwnership.toString()
        const tsupply = ContractInfo.tSupply.toString()

        SetState((draft) => {
          draft.baseURI = baseURI
          draft.name = name
          draft.ownerAddress = ownerAddress
          draft.price = price
          draft.symbol = symbol
          draft.tOwnership = tOwnership
          draft.tsupply = tsupply
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
            draft.userBalance = formatEther(userBalance.toString())
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
      const value = totalMint * State.price
      console.log("Approve", FactoryAddress, value)
      try {
        const tx = await ContractUSDT.approve(
          FactoryAddress,
          parseEther(value.toString())
        )
        await tx.wait()
        setSate(false)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const onSubmit = async (data) => {
    const value = totalMint * State.price
    console.log("Submit", totalMint, value)
    try {
      const tx = await ContractFactory.buyOwnership(
        totalMint,
        parseEther(value.toString()),
        Contract
      )

      await tx.wait()

      navigate(`/collected`)
    } catch (e) {
      console.error(e)
    }
  }
  console.log(errors)

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="mb-20 text-center">
        <h1 className="mb-1 font-bold text-5xl "> Your OwnerShips</h1>
        <div className="max-w-3xl mx-auto text-center">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque ipsa
          commodi accusamus cupiditate blanditiis nihil voluptas architecto
          numquam, omnis delectus?
        </div>
      </div>
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Mint Your NFT
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui,
                hic ducimus! At, rerum expedita quisquam maxime ipsum distinctio
                enim delectus ad illum accusantium ipsa, fugiat eum obcaecati
                cupiditate nostrum iste.
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
                        {account}
                      </p>
                      {/* <input
                        type="text"
                        placeholder="0x0000000000000000000000000000000000000000"
                        value={account}
                        {...register("Last name", {
                          required: true,
                          maxLength: 100,
                        })}
                        className="w-full py-2.5 px-3 border mb-4 rounded-md"
                      /> */}
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supply
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        {State.tOwnership}/{State.tsupply}
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
                        Total Mint
                      </label>
                      <input
                        type="number"
                        placeholder="Total Mint"
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
