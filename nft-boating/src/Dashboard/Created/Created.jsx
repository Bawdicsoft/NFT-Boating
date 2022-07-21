import { Link, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import { useContextAPI } from "./../../ContextAPI";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";

/* This example requires Tailwind CSS v2.0+ */
import { PencilIcon } from "@heroicons/react/solid";

export default function Created() {
  const { account, active } = useWeb3React();
  const { ContractFactory, NFTYacht, provider } = useContextAPI();

  const [state, SetState] = useImmer({
    data: [],
    userNFT: 0
  });

  useEffect(() => {
    if (active) {
      const run = async () => {
        let addresses;
        try {
          addresses = await ContractFactory.getUserAllContractAddress(account);
        } catch (e) {
          console.log(e);
        }

        if (addresses.length) {
          for (let i = 0; i < addresses.length; i++) {
            const contractData = await ContractFactory.getContractInfo(
              addresses[i]
            );

            console.log(contractData);

            const data = {
              id: i,
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

            console.log(data);

            SetState(draft => {
              draft.userNFT = addresses.length;
              draft.data.push(data);
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

  const navigate = useNavigate();
  const createNew = () => {
    navigate(`/create-new`);
  };

  return (
    <div className="Created min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Your Contracts {state.userNFT}
              </h1>
              <p className="max-w-2xl">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque ipsa commodi accusamus cupiditate blanditiis nihil voluptas architecto numqquam, omnis delecctus ipsa adippisicing?</p>
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <span className="sm:ml-3">
                <button
                  onClick={createNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon
                    className="-ml-1 mr-2 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  Create New
                </button>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto py-10 sm:py-10 lg:py-10 lg:max-w-none">
            <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6">
              {state.data.map(Contract => (
                <div key={Contract.id} className="group relative">
                  <div className="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75  lg:aspect-none">
                    <img
                      src={Contract.imageSrc}
                      alt={Contract.imageAlt}
                      className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link to={`/contract/${Contract.contractAddress}`}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {Contract.name} ({Contract.symbol})
                        </Link>
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
