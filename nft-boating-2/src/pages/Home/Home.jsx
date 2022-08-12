import { useImmer } from "use-immer"
import { useEffect, useState } from "react"
import { useContextAPI } from "./../../ContextAPI"
import { ethers } from "ethers"
import { Link } from "react-router-dom"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../../DB/firebase-config"
import GoogleMapReact from "google-map-react"
import axios from "axios"

const products = [
  {
    id: 1,
    name: "Miami",
    href: "#",
    price: "$48",
    imageSrc:
      "https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
    marker: {
      lat: 25.761681,
      lng: -80.191788,
      name: "Miami",
      color: "blue",
    },
  },
  {
    id: 3,
    name: "Myrtle Beach",
    href: "#",
    price: "$89",
    imageSrc:
      "https://images.pexels.com/photos/4934659/pexels-photo-4934659.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
    marker: {
      lat: 33.68906,
      lng: -78.886696,
      name: "Myrtle Beach",
      color: "blue",
    },
  },
  {
    id: 4,
    name: "West Palm Beach",
    href: "#",
    price: "$35",
    imageSrc:
      "https://images.pexels.com/photos/4934661/pexels-photo-4934661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
    marker: {
      lat: 26.709723,
      lng: -80.064163,
      name: "West Palm Beach",
      color: "blue",
    },
  },
  // More products...
]

export default function Home() {
  const [state, setState] = useImmer({
    boats: [],
    locations: [],
    boatsID: [],
    contractCounter: null,
    isLoding: true,
    hoveredName: "",
  })

  console.log("home boats", state.boats)

  useEffect(() => {
    const run = async () => {
      const querySnapshot = await getDocs(collection(db, "ContractInfo"))
      console.log(">>>>>>", querySnapshot)
      querySnapshot.forEach(async (doc) => {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${
            doc.data().location
          }&key=AIzaSyCtSZl9y1AEVHZhs0wrhhtmK7RunH71K5k`
        )

        const location = {
          lat: res.data.results[0].geometry.location.lat,
          lng: res.data.results[0].geometry.location.lng,
          name: doc.data().name,
        }

        setState((d) => {
          d.boats.push(doc.data())
          d.locations.push(location)
          d.boatsID.push(doc.id)
          d.isLoding = false
        })
      })
    }
    run()
  }, [])

  return (
    <div className="bg-white">
      <div className="max-w-7xl px-10 mx-auto py-16 sm:py-24">
        <div className=" mb-20 text-center">
          <h1 className="mb-3 font-bold text-5xl "> Our Fleet </h1>
          <div className="max-w-3xl mx-auto text-center">
            Presenting our fleet of sensational boats for you to choose from.
            Select one and get one step closer to fulfilling your long pending
            voyage across the horizon. Services provided on each of our listed
            vessels can be customized to your choice so grab a boat and ride on…
          </div>
          <div className="max-w-3xl mx-auto text-center">Book Now!</div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 sm:col-span-2">
            <div className=" grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-3">
              {state.isLoding ? (
                <>
                  <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                </>
              ) : (
                <>
                  {state.boats.map((boat, index) => (
                    <div key={index} className="group relative">
                      <div className="w-full mh-96 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                        <img
                          src={boat.featuredImage}
                          // alt={Contract.imageAlt}
                          className="w-full h-96 object-center object-cover lg:w-full lg:h-full"
                        />
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">
                            <Link to={`/boat/${state.boatsID[index]}`}>
                              <span
                                aria-hidden="true"
                                className="absolute inset-0"
                              />
                              {boat.name}
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

          <div className="col-span-3 sm:col-span-1">
            <div className="inline-flex w-full h-[80vh] shadow rounded-lg">
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyCtSZl9y1AEVHZhs0wrhhtmK7RunH71K5k",
                }}
                center={{
                  lat: 25.761681,
                  lng: -80.191788,
                }}
                defaultZoom={8}
              >
                {state.locations.map((location, index) => {
                  return (
                    <Marker
                      key={location.lat + location.lng + index}
                      lat={location.lat}
                      lng={location.lng}
                      name={location.name}
                      hoveredItem={location.name == state.hoveredName}
                    />
                  )
                })}
              </GoogleMapReact>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Marker = (props) => {
  const { color, name, id, hoveredItem } = props
  return (
    <div className="relative flex flex-col items-center group">
      <div
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        fill="currentColor"
      >
        <div
          className={`pin bounce ${hoveredItem && "pinHovered"} `}
          style={{ backgroundColor: "red", cursor: "pointer" }}
          title={name}
        />
        <div className="pulse" />
      </div>
      <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
        <span
          style={{ minWidth: "100px", minHeight: "50px" }}
          className="relative text-center rounded z-10 p-2 text-xs leading-none text-black whitespace-no-wrap bg-white shadow-lg"
        >
          <h5>{name}</h5>
        </span>
        {/* <div className="w-3 h-3 -mt-2 rotate-45 bg-black">hello</div> */}
      </div>
    </div>
  )
}
