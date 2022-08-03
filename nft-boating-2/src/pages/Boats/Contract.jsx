import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { ethers } from "ethers"
import { useContextAPI } from "../../ContextAPI"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import image1 from "../../Assets/images/image1.jpg"
import image2 from "../../Assets/images/image2.jpg"
import image3 from "../../Assets/images/image3.jpg"
import image4 from "../../Assets/images/wedding.jpg"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../DB/firebase-config"

const product = {
  name: "",
  symbol: "",
  totalSupply: "",
  price: "",
  walletAddress: "",
  images: [],
  description: "",
}

export default function Contract() {
  const { Contract } = useParams()
  const { NFTYacht, provider } = useContextAPI()
  const ContractNFTYacht = new ethers.Contract(Contract, NFTYacht, provider)

  const [State, SetState] = useImmer({
    Contract: {
      name: "name",
      symbol: "symbol",
    },
    product: {
      name: ".....",
      symbol: "..",
      totalSupply: "00",
      price: "0.0",
      walletAddress: "0x0000000000000000000000",
      images: [],
      description: "................",
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
          d.product.name = docSnap.data().data.name
          d.product.symbol = docSnap.data().data.symbol
          d.product.totalSupply = docSnap.data().data.totalSupply
          d.product.price = docSnap.data().data.price
          d.product.walletAddress = docSnap.data().data.walletAddress
          d.product.images = docSnap.data().imgUrls
          d.product.description = docSnap.data().data.description
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
              ` bg-slate-500 rounded-lg h-96 ` +
              (State.isLoading && "animate-pulse")
            }
          >
            <img
              src={State.product.images[0]}
              // alt={product.images[0].alt}
              className="w-screen h-96 bg-slate-500 object-center object-cover rounded-lg"
            />
          </div>
        </div>

        {/* {!State.isLoading ? (
          <div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
            <div className="hidden aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block">
              <img
                src={State.product.images[0]}
                // alt={product.images[0].alt}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <img
                  src={State.product.images[1]}
                  // alt={product.images[1].alt}
                  className="w-full h-full object-center object-cover"
                />
              </div>
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <img
                  src={State.product.images[2]}
                  // alt={product.images[2].alt}
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </div>
            <div className="aspect-w-4 aspect-h-5 sm:rounded-lg sm:overflow-hidden lg:aspect-w-3 lg:aspect-h-4">
              <img
                src={State.product.images[3]}
                // alt={product.images[3].alt}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>
        ) : (
          // <div className="px-4 py-6 sm:px-0">
          //   <img
          //     src={State.product.images[0]}
          //     // alt={product.images[0].alt}
          //     className="w-screen h-96 bg-slate-500 object-center object-cover"
          //   />
          // </div>
          <div className="animate-pulse  mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-3 lg:gap-x-8">
            <div className="hidden aspect-w-3 aspect-h-4 rounded-lg overflow-hidden lg:block">
              <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>

              <img
                src={State.product.images[0]}
                // alt={product.images[0].alt}
                className="w-screen h-96 bg-slate-500 object-center object-cover"
              />
            </div>
          </div>
        )} */}

        {/* Product info */}
        <div className="max-w-2xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:pt-16 lg:pb-24 lg:px-8 lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {State.product.name} ({State.product.symbol}) USDT:{" "}
              {State.product.price}
            </h1>
            <p>
              Owner: {State.product.walletAddress.slice(0, 5)}...
              {State.product.walletAddress.slice(-4)}
            </p>
          </div>

          {/* Options */}
          <div className="mt-4 lg:mt-0 lg:row-span-3">
            <h2 className="mb-1 font-bold">Buy MemberShip Form</h2>
            <p className="font-normal mb-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Architecto, maiores?{" "}
            </p>
            <Link
              to={`/Contract/${Contract}/buy-nft`}
              className="mb-5 cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Buy NFT
            </Link>
          </div>

          <div className="py-10 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            {/* Description and details */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="space-y-6">
                <p className="text-base text-gray-900">
                  {State.product.description}
                </p>
              </div>
            </div>

            {/* <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

            <div className="mt-4">
                <ul role="list" className="pl-4 list-disc text-sm space-y-2">
                  {product.highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">{product.details}</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
