import { useImmer } from "use-immer"
import { useEffect } from "react"
import { useContextAPI } from "./../../ContextAPI"
import { ethers } from "ethers"
import { Link } from "react-router-dom"

export default function Home() {
  const { ContractFactory, NFTYacht, provider } = useContextAPI()
  const [state, setState] = useImmer({
    data: [],
    contractCounter: null,
    isLoding: true
  })

  const callEvent = () => {
    ContractFactory.on("deploy_", () => {
      console.log("callEvent > Event")
    })
  }

  useEffect(() => {
    const run = async () => {
      let addresses
      try {
        addresses = await ContractFactory.allContractAddress()
      } catch (e) {
        console.error(e)
      }

      for (let i = 0; i < addresses.length; i++) {
        const ContractUSDT = new ethers.Contract(
          addresses[i],
          NFTYacht,
          provider
        )

        const name = await ContractUSDT.name()
        const symbol = await ContractUSDT.symbol()

        const date = {
          id: i,
          name: name,
          symbol: symbol,
          address: addresses[i],
          imageSrc:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9S6_bhnGv0Gh--081Azem3rSTXXd-_sc9jA&usqp=CAU",
          imageAlt: "Front of men's Basic Tee in black."
        }

        setState(draft => {
          draft.data.push(date)
          draft.isLoding = false
        })
      }
    }
    run()
    callEvent()
  }, [state.contractCounter])

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className=" mb-20 text-center">
          <h1 className="mb-1 font-bold text-5xl "> Home </h1>
          <div className="max-w-3xl mx-auto text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque
            ipsa commodi accusamus cupiditate blanditiis nihil voluptas
            architecto numquam, omnis delectus?
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {state.isLoding ? (
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
              {state.data.map(Contract => (
                <div key={Contract.id} className="group relative">
                  <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                    <img
                      src={Contract.imageSrc}
                      alt={Contract.imageAlt}
                      className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <Link to={`/contract/${Contract.address}`}>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0"
                          />
                          {Contract.name}
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
  )
}
