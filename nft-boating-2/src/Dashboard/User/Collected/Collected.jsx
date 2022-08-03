import { useEffect } from "react"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import { PencilIcon } from "@heroicons/react/solid"
import { useWeb3React } from "@web3-react/core"
import { useContextAPI } from "../../../ContextAPI"
import axios from "axios"

export default function Collected() {
  const navigate = useNavigate()
  const { account, active } = useWeb3React()
  const { ContractFactory, ContractDeploy } = useContextAPI()

  const buyNew = () => {
    navigate(`/`)
  }

  const [state, SetState] = useImmer({
    isLoading: true,
    data: [],
    userNFT: 0,
    images: null,
  })

  useEffect(() => {
    if (active) {
      SetState((draft) => {
        draft.userNFT = 0
        draft.data = []
        draft.isLoading = true
      })

      const run = async () => {
        await axios({
          url: `https://gateway.pinata.cloud/ipfs/QmZbBsJho23qXZo5XG8NqPeZBpRUj6Kcf9KqeFU4GA64wS/`,
          method: "get",
        })
          .then((response) => {
            SetState((draft) => {
              draft.images = response.data.image
            })
          })
          .then((err) => {
            console.log(err)
          })

        let addresses
        try {
          addresses = await ContractFactory.UserAllContractAddress(account)
        } catch (e) {
          console.log(e)
        }

        if (addresses.length) {
          for (let i = 0; i < addresses.length; i++) {
            let UserIDs
            let contractData
            try {
              UserIDs = await ContractFactory.UserIDs(addresses[i], account)
              contractData = await ContractDeploy.contractDitals(addresses[i])
            } catch (error) {
              console.log(error)
            }

            const id = contractData.id.toString()
            const name = contractData.name.toString()
            const symbol = contractData.symbol.toString()
            const tSupply = contractData.tSupply.toString()
            const tOwnership = contractData.tOwnership.toString()
            const price = contractData.price.toString()
            const owner = contractData.owner.toString()
            const baseURI = contractData.baseURI.toString()

            UserIDs.forEach((nftid) => {
              let data = {
                nftNumber: nftid.toString(),

                id: id,
                name: name,
                symbol: symbol,
                tSupply: tSupply,
                tOwnership: tOwnership,
                price: price,
                owner: owner,
                baseURI: baseURI,

                contractAddress: addresses[i].toString(),
                imageSrc: `https://cloudflare-ipfs.com/ipfs/QmZbBsJho23qXZo5XG8NqPeZBpRUj6Kcf9KqeFU4GA64wS/`,
                imageAlt: "Front of men's Basic Tee in black.",
              }
              SetState((draft) => {
                draft.userNFT = UserIDs.length
                draft.data.push(data)
                draft.isLoading = false
              })
            })
          }
        } else {
          SetState((draft) => {
            draft.userNFT = 0
            draft.isLoading = false
          })
        }
      }
      run()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <div className="Collected min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Member Ships ( NFT )
              </h1>
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
            <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-6">
              {state.isLoading ? (
                <>
                  <div className="px-4 py-6 sm:px-0">
                    <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  </div>
                  <div className="px-4 py-6 sm:px-0">
                    <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  </div>
                  <div className="px-4 py-6 sm:px-0">
                    <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  </div>
                  <div className="px-4 py-6 sm:px-0">
                    <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  </div>
                </>
              ) : (
                <>
                  {state.data.map((Contract) => (
                    <div
                      key={Contract.nftNumber + Math.random()}
                      className="group relative"
                    >
                      <div className="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75  lg:aspect-none">
                        <img
                          src={state.images}
                          alt={Contract.imageAlt}
                          className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                        />
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            <Link
                              to={`/contract/${Contract.contractAddress}/nft/${Contract.nftNumber}`}
                            >
                              <span
                                aria-hidden="true"
                                className="absolute inset-0"
                              />
                              ( {Contract.name} ) #{Contract.nftNumber}
                            </Link>
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
