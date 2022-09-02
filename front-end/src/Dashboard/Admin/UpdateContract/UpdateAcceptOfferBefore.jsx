import { useForm } from "react-hook-form"
import { useContextAPI } from "../../../ContextAPI"
import { parseUnits } from "ethers/lib/utils"

export default function UpdateAcceptOfferBefore({ Contract, setOpen }) {
  const { ContractFactory } = useContextAPI()
  const { register, handleSubmit } = useForm()

  const handleUpdatePrice = async (data) => {
    try {
      const tx = await ContractFactory.updateAcceptOfferBefore(
        new Date(data.Date).valueOf()
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
          <h2 className="py-2">Update Accept Offer Before</h2>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date:
              </label>
              <input
                className="w-full py-2.5 px-3 border mb-2 rounded-md"
                type="date"
                placeholder="Date"
                {...register("Date", {
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
