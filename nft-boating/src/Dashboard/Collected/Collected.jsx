import { ethers } from "ethers"
import { useEffect } from "react"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import { PencilIcon } from "@heroicons/react/solid"
import { useWeb3React } from "@web3-react/core"
import { useContextAPI } from "./../../ContextAPI"
import nftImage from "../../Assets/images/yachat.jpg"

export default function Collected() {
  const navigate = useNavigate()
  const { account, active } = useWeb3React()
  const { ContractFactory, NFTYacht, provider } = useContextAPI()

  const buyNew = () => {
    navigate(`/`)
  }

  const [state, SetState] = useImmer({
    data: [],
    userNFT: 0,
  })

  console.log(state)

  useEffect(() => {
    if (active) {
      const run = async () => {
        let addresses
        try {
          addresses = await ContractFactory.getMapUserAllContractAddress(
            account
          )
        } catch (e) {
          console.log(e)
        }

        if (addresses.length) {
          for (let i = 0; i < addresses.length; i++) {
            const getUserIDs = await ContractFactory.getUserIDs(
              addresses[i],
              account
            )

            const contractData = await ContractFactory.getContractInfo(
              addresses[i]
            )
            console.log(contractData)

            getUserIDs.map((nftid) => {
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
                imageSrc: nftImage,
                imageAlt: "Front of men's Basic Tee in black.",
              }
              SetState((draft) => {
                draft.userNFT = getUserIDs.length
                draft.data.push(data)
              })
            })
          }
        } else {
          SetState((draft) => {
            draft.userNFT = 0
          })
        }
      }
      run()
    }
  }, [active])

  return (
    <div className="Collected min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Collected ( NFT )
              </h1>
              {/* <p className="max-w-2xl">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque
                ipsa commodi accusamus cupiditate blanditiis nihil voluptas
                architecto numqquam, omnis delecctus ipsa adippisicing?
              </p> */}
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <span className="sm:ml-3">
                <button
                  onClick={buyNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon
                    className="-ml-1 mr-2 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  Buy New
                </button>
              </span>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto py-10 sm:py-10 lg:py-10 lg:max-w-none">
            <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-6">
              {state.data.map((Contract) => (
                <div
                  key={Contract.nftNumber + Math.random()}
                  className="group relative"
                >
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
                        <Link
                          to={`/contract/${Contract.contractAddress}/nft/${Contract.nftNumber}`}
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {Contract.nftNumber}
                          {Contract.name}
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
  )
}
