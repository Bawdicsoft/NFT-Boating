import { useForm } from "react-hook-form";

export default function BuyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleApprove = () => {};

  const onSubmit = data => console.log(data);
  console.log(errors);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Mint Your NFT
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Use a permanent address where you can receive mail.
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
                      <input
                        type="text"
                        placeholder="0x0000000000000000000000000000000000000000"
                        {...register("Last name", {
                          required: true,
                          maxLength: 100
                        })}
                        className="w-full py-2.5 px-3 border mb-4 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supply
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        00/00
                      </p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your USDT Balance
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        00.00
                      </p>
                    </div>

                    <div></div>

                    <div className="col-span-6 sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Price USDT:<span> 0.0</span>
                      </label>
                      <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                        USDT : <span>0.0</span>
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
                          min: 0
                        })}
                        className="w-full py-2.5 px-3 border mb-4 rounded-md "
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <input
                        onClick={handleApprove}
                        className="cursor-pointer text-center w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        value="Approve"
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <input
                        className="cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        type="submit"
                        value="Transaction"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
