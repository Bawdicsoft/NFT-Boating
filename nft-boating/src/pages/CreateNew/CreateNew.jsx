import { useForm } from "react-hook-form";

export default function CreateNew() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = data => console.log(data);
  console.log(errors);

  return (
    <div className="CreateNew min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Profile
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>
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
                            {...register("Name", {
                              required: true,
                              minLength: 6,
                              maxLength: 12
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
                            {...register("Symbol", {
                              required: true,
                              minLength: 6,
                              maxLength: 12
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
                            {...register("Total Supply", {
                              required: true,
                              minLength: 6,
                              maxLength: 12
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
                            {...register("Price", {
                              required: true,
                              minLength: 6,
                              maxLength: 12
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
                          <input
                            type="number"
                            placeholder="0x0000000000000000000000000000000000000000"
                            {...register("Owner Address", {
                              required: true,
                              maxLength: 100
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
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
                              {...register("Last name", {
                                required: true,
                                maxLength: 100
                              })}
                              className="w-full py-2.5 px-3 flex-1 block rounded-none rounded-r-md border"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Brief description for your profile. URLs are
                            hyperlinked.
                          </p>
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          <input
                            className="cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            type="submit"
                            value="Book Dates"
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
      </main>
    </div>
  );
}
