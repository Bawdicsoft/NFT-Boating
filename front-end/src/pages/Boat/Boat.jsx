import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { ethers } from "ethers"
import { useContextAPI } from "../../ContextAPI"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../DB/firebase-config"
import Map from "../../Comp/Map/Map"
import { Carousel } from "flowbite-react"

export default function Boat() {
  const { Contract } = useParams()
  const { NFTYacht, provider } = useContextAPI()
  const ContractNFTYacht = new ethers.Contract(Contract, NFTYacht, provider)

  const [State, SetState] = useImmer({
    request: {
      featuredImage: "",
      coverImage: "",
      name: "xxxx",
      year: "0000",
      make: "xxxx",
      model: "xxxx",
      price: "0.0",
      walletAddress: "0x000000000",
      description: "description",
    },
    isLoading: true,
  })

  useEffect(() => {
    const run = async () => {
      const docRef = doc(db, "ContractInfo", Contract)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data())
        SetState((d) => {
          d.request = docSnap.data()
          d.isLoading = false
        })
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!")
      }
    }
    run()
  }, [Contract])

  useEffect(() => {
    const run = async () => {
      try {
        var name = await ContractNFTYacht.name()

        // converting first letter to uppercase
        function capitalizeFirstLetter(str) {
          const capitalized = str.replace(/^./, str[0].toUpperCase())
          return capitalized
        }
        var name = capitalizeFirstLetter(name)

        const symbol = await ContractNFTYacht.symbol()
        SetState((draft) => {
          draft.name = name
          draft.symbol = symbol
        })
      } catch (e) {}
    }
    run()
  }, [Contract])

  return (
    <div className="bg-white">
      <div className="pt-6">
        {/* Image gallery */}

        <div className=" mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
          <div
            className={
              ` bg-slate-500 rounded-lg ` + (State.isLoading && "animate-pulse")
            }
          >
            <div className="h-56 bg-slate-500 sm:h-64 xl:h-80 2xl:h-96 rounded-lg">
              {State.request.gallery && (
                <Carousel>
                  {State.request.gallery.map((img, index) => (
                    <img src={img} key={index} alt="..." />
                  ))}
                </Carousel>
              )}
            </div>
            {/* <img
              src={State.request.coverImage}
              alt=""
              className="w-screen h-96 bg-slate-500 object-center object-cover rounded-lg"
            /> */}
          </div>
        </div>

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {State.request.name}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:mt-0 lg:row-span-3">
            <div>
              <h2 className="mb-1 font-bold">Buy MemberShip</h2>
              <p className="font-normal mb-3">
                Don't wait any longer, become a member of your desired boat now!
              </p>
              <Link
                to={`/Contract/${Contract}/buy-nft`}
                className="mb-5 cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Buy MemberShip
              </Link>
            </div>

            <div>
              <p>
                <span className="text-base text-gray-900">year: </span>
                {State.request.year}
              </p>
              <p>
                <span className="text-base text-gray-900">length: </span>
                {State.request.length}
              </p>
              <p>
                <span className="text-base text-gray-900">make: </span>
                {State.request.make}
              </p>
              <p>
                <span className="text-base text-gray-900">model: </span>
                {State.request.model}
              </p>
              <p>
                <span className="text-base text-gray-900">capacity: </span>
                {State.request.capacity}
              </p>
              <p>
                <span className="text-base text-gray-900">boatType: </span>
                {State.request.boatType}
              </p>
              <p>
                <span className="text-base text-gray-900">sleeps: </span>
                {State.request.sleeps}
              </p>
              <p>
                <span className="text-base text-gray-900">staterooms: </span>
                {State.request.staterooms}
              </p>
              <p>
                <span className="text-base text-gray-900">bedCount: </span>
                {State.request.bedCount}
              </p>
              <p>
                <span className="text-base text-gray-900">amenities: </span>
                {State.request.amenities}
              </p>
            </div>
          </div>

          <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            {/* Description and details */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {State.request.description}
                </p>
              </div>
            </div>

            <Map address={State.request.location} />
          </div>
        </div>
      </div>
    </div>
  )
}
