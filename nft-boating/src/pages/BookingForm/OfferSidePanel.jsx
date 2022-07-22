/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useForm } from "react-hook-form";
import DatePicker, {
  utils
} from "@amir04lm26/react-modern-calendar-date-picker";
import { useWeb3React } from "@web3-react/core";
import { useContextAPI } from "../../ContextAPI";
import { useImmer } from "use-immer";
import { formatEther, parseEther } from "ethers/lib/utils";

export default function OfferSidePanel({
  open,
  setOpen,
  errordate,
  id,
  Contract
}) {
  console.log({ errordate });

  const [selectedDay, setSelectedDay] = useState("");
  const [disabledDays, setDisabledDays] = useState([]);

  const date = new Date().toISOString().split("T")[0];
  const minimumDate = {
    year: date.slice(0, 4),
    month: date.slice(5, 7),
    day: date.slice(8, 10)
  };

  const availDate = new Date(new Date().setDate(new Date().getDate() + 20));
  const daysAdded = availDate.toISOString().split("T")[0];
  const maximumDate = {
    year: daysAdded.slice(0, 4),
    month: daysAdded.slice(5, 7),
    day: daysAdded.slice(8, 10)
  };

  const handleDisabledSelect = async disabledDay => {
    for (let i = 0; i < disabledDays.length; i++) {
      if (disabledDays[i].day === disabledDay.day) {
        // await ContractNFTYacht.getBookDateID(
        //   disabledDay.year,
        //   disabledDay.month,
        //   disabledDay.day
        // ).then(res => {
        //   setGetBookDateID(res.toString());
        //   setDateError(disabledDay);
        // });
      }
    }
  };

  const { account, active } = useWeb3React();
  const { ContractFactory, FactoryAddress, ContractUSDT } = useContextAPI();

  const [state, SetState] = useImmer({
    data: [],
    userNFT: 0
  });

  console.log(state);

  useEffect(() => {
    if (active) {
      const run = async () => {
        let addresses;
        try {
          addresses = await ContractFactory.getMapUserAllContractAddress(
            account
          );
        } catch (e) {
          console.log(e);
        }

        if (addresses.length) {
          for (let i = 0; i < addresses.length; i++) {
            const getUserIDs = await ContractFactory.getUserIDs(
              addresses[i],
              account
            );

            const contractData = await ContractFactory.getContractInfo(
              addresses[i]
            );
            console.log(contractData);

            getUserIDs.map(nftid => {
              let data = {
                nftNumber: nftid.toString(),
                name: contractData.name.toString(),
                symbol: contractData.symbol.toString(),
                tSupply: contractData.tSupply.toString(),
                tOwnership: contractData.tOwnership.toString(),
                price: contractData.price.toString(),
                ownerAddress: contractData.ownerAddress.toString(),
                baseURI: contractData.baseURI.toString(),
                contractAddress: addresses[i].toString(),
                imageSrc:
                  "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
                imageAlt: "Front of men's Basic Tee in black."
              };
              SetState(draft => {
                draft.userNFT = getUserIDs.length;
                draft.data.push(data);
              });
            });
          }
        } else {
          SetState(draft => {
            draft.userNFT = 0;
          });
        }
      };
      run();
    }
  }, [active]);

  const offerFunc = async () => { };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const amount = watch("amount");

  const Submit = async data => {
    try {
      // offer(address _Contract, uint _id, uint _userID, uint256 _USDT )
      const tx = await ContractFactory.offer(
        Contract,
        id,
        data.userID,
        parseEther(data.amount)
      );
      await tx.wait();
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const [button, setButton] = useState(true);


  const handleApprove = async e => {
    console.log("handleApprove run", FactoryAddress, parseEther(amount));
    try {
      await ContractUSDT.approve(FactoryAddress, parseEther(amount));
      setButton(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {errordate.day}-{errordate.month}-{errordate.year}
                      </Dialog.Title>
                      <p className="text-red-900">
                        * This date is already booked , You can still book this
                        Date.
                      </p>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <form onSubmit={handleSubmit(Submit)}>
                        <div className="shadow sm:rounded-md">
                          <div className="px-4 py-5 bg-white sm:p-6">
                            <div className="grid grid-cols-6 gap-4">
                              <div className="col-span-6 sm:col-span-6">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Amount
                                </label>
                                <input
                                  type="text"
                                  placeholder="amount"
                                  className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                  {...register("amount", {
                                    required: true
                                  })}
                                />
                              </div>
                              <div className="col-span-6 sm:col-span-6">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Select Your Nft
                                </label>
                                <select
                                  className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                  {...register("userID", {
                                    required: true
                                  })}
                                >
                                  {state.data.map(item => {
                                    return (
                                      <>
                                        <option
                                          className="w-full py-2.5 px-3 border mb-2 rounded-md"
                                          value={item.nftNumber}
                                        >
                                          {item.nftNumber}
                                        </option>
                                      </>
                                    );
                                  })}
                                </select>
                              </div>

                              <div className="col-span-6 sm:col-span-3">
                                <span
                                  onClick={handleApprove}
                                  className={"text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 " + (button ? "bg-indigo-600  hover:bg-indigo-700 cursor-pointer" : "bg-gray-600 opacity-50 cursor-not-allowed")}
                                >
                                  Approve
                                </span>
                              </div>
                              <div className="col-span-6 sm:col-span-3">
                                <button
                                  className={"text-center w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 " + (button ? "bg-gray-600 opacity-50 cursor-not-allowed" : "bg-indigo-600  hover:bg-indigo-700 cursor-pointer")}
                                  type="submit"
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
