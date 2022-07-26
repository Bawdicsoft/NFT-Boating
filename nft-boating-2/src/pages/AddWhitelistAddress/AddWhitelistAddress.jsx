import { useForm } from "react-hook-form"
import { useContextAPI } from "./../../ContextAPI"
import { useWeb3React } from "@web3-react/core"
import { useImmer } from "use-immer"
import { useNavigate } from "react-router-dom"
import { Injected } from "./../../Comp/Wallets/Connectors"

export default function AddWhitelistAddress() {
  const { account, active, activate } = useWeb3React()

  const { ContractFactory } = useContextAPI()
  const navigate = useNavigate()

  const [state, setState] = useImmer({
    submitBtnDisable: false
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async data => {
    console.log({ data })

    setState(draft => {
      draft.submitBtnDisable = true
    })

    try {
      await ContractFactory.addAddressToWhitelist(data.address)
    } catch (e) {
      console.log(">>>>>>>>>>>>>>", e)
      setState(draft => {
        draft.submitBtnDisable = false
      })
    }

    ContractFactory.on("deploy_", _Contract => {
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
          <h1 className="mb-1 font-bold text-5xl "> Add Whitelist Address </h1>
          <div className="max-w-3xl mx-auto text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque
            ipsa commodi accusamus cupiditate blanditiis nihil voluptas
            architecto numquam, omnis delectus?
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-[500px] mx-auto py-6 sm:px-6 lg:px-8">
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-6 sm:col-span-6">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="Address"
                        {...register("address", {
                          required: true
                        })}
                        className="w-full py-2.5 px-3 border mb-4 rounded-md"
                      />
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
                          disabled={state.submitBtnDisable}
                        >
                          Add Whitelist Address
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
