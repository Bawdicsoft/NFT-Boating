import { useImmer } from "use-immer"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../DB/firebase-config"
import GoogleMapReact from "google-map-react"
import axios from "axios"

export default function Home() {
  const [state, setState] = useImmer({
    boats: [],
    locations: [],
    boatsID: [],
    contractCounter: null,
    isLoading: true,
    hoveredName: "",
  })

  useEffect(() => {
    const run = async () => {
      const querySnapshot = await getDocs(collection(db, "ContractInfo"))

      querySnapshot.forEach(async (doc) => {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${
            doc.data().location
          }&key=${process.env.REACT_APP_MAPKEY}`
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
          d.isLoading = false
        })
      })

      if (state.boats.length === 0) {
        setState((d) => {
          d.isLoading = false
        })
      }
    }
    run()
  }, [])

  return (
    <div className="bg-white">
      <div className="max-w-7xl px-10 mx-auto py-16 sm:py-24">
        <div className=" mb-20 text-center">
          <h1 className="mb-3 font-bold text-5xl ">Boat Rentals</h1>
          <p className="max-w-3xl mx-auto text-center">
            NFT Boating provides the perfect luxury boat rental for your
            upcoming voyage across the horizon. Our fleet of breathtaking boats
            will take you to your desired destination in style and comfort. Each
            of our listed vessels comes equipped with NFT Boating's exclusive
            service, which can be customized to your choice*.
          </p>
          <p className="max-w-3xl mx-auto text-center">
            Sign up, browse our rentals, and get one step closer to fulfilling
            your long-overdue vacation at sea. NFT Boating looks forward to
            providing you with the best possible experience during your special
            day. Book now to experience the freedom of NFT Boating!
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-3 sm:col-span-2">
            <div className=" grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-3">
              {state.isLoading ? (
                <>
                  <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                  <div className="animate-pulse bg-slate-500 rounded-lg h-96"></div>
                </>
              ) : (
                <>
                  {state.boats.length > 0 ? (
                    <>
                      {state.boats.map((boat, index) => (
                        <div key={index} className="group relative">
                          <div className="w-full mh-96 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                            <img
                              src={boat.featuredImage}
                              alt=""
                              className="w-full h-96 object-center object-cover lg:w-full lg:h-full"
                            />
                          </div>
                          <div className="mt-2 flex justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-700">
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
                  ) : (
                    <>
                      <div></div>
                      <h1 className="text-center">No boats fund</h1>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="col-span-3 sm:col-span-1">
            {state.boats.length > 0 && (
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
                        hoveredItem={location.name === state.hoveredName}
                      />
                    )
                  })}
                </GoogleMapReact>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Marker = (props) => {
  const { name, hoveredItem } = props
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
