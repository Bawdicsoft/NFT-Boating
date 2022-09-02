import { useForm } from "react-hook-form"
import { useContextAPI } from "../../../ContextAPI"
import { parseUnits } from "ethers/lib/utils"

export default function UpdatePrice({ Contract, setOpen }) {
  const { ContractDeploy } = useContextAPI()
  const { register, handleSubmit } = useForm()

  const handleUpdatePrice = async (data) => {
    try {
      const tx = await ContractDeploy.updatePrice(
        Contract,
        parseUnits(data.Amount.toString(), 6).toString()
      )
      await tx.wait()
      setOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleUpdatePrice)}>
      <div className="shadow sm:rounded-md">
        <div className="px-4 py-5 bg-white sm:p-6">
          <h2 className="py-2">Update Price</h2>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount:
              </label>
              <input
                className="w-full py-2.5 px-3 border mb-2 rounded-md"
                type="text"
                placeholder="Amount"
                {...register("Amount", {
                  required: true,
                })}
              />
            </div>

            <div className="col-span-6">
              <button
                className="text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600  hover:bg-indigo-700 cursor-pointer"
                type="submit"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
