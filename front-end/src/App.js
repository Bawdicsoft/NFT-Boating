import React, { Suspense } from "react"
import { Route, Routes } from "react-router-dom"

// Comp
import Header from "./Comp/Header/Header"
import Footer from "./Comp/Footer/Footer"

// Pages
/* eslint-disable import/first */
import LandingPage from "./pages/LandingPage/LandingPage"
const Home = React.lazy(() => import("./pages/Home/Home"))
const BuyForm = React.lazy(() => import("./pages/BuyForm/BuyForm"))
const BookingForm = React.lazy(() => import("./pages/BookingForm/BookingForm"))
const Boat = React.lazy(() => import("./pages/Boat/Boat"))
const ListBoat = React.lazy(() => import("./pages/ListBoat/ListBoat"))
const AddWhitelistAddress = React.lazy(() =>
  import("./pages/ListBoat/ListBoat")
)
const About = React.lazy(() => import("./pages/About/About"))

// Dashboard
const CreateNew = React.lazy(() =>
  import("./Dashboard/Host/CreateNew/CreateNew")
)
const OffersReceived = React.lazy(() =>
  import("./Dashboard/User/OffersReceived/OffersReceived")
)
const OffersMade = React.lazy(() =>
  import("./Dashboard/User/OffersMade/OffersMade")
)
const BookedDate = React.lazy(() =>
  import("./Dashboard/User/BookedDate/BookedDate")
)
const Collected = React.lazy(() =>
  import("./Dashboard/User/Collected/Collected")
)
const Boats = React.lazy(() => import("./Dashboard/Host/Boats/Boats"))
const NFT = React.lazy(() => import("./Dashboard/User/NFT/NFT"))
const BookedDates = React.lazy(() =>
  import("./Dashboard/Admin/BookedDates/BookedDates")
)
const Requsts = React.lazy(() => import("./Dashboard/Admin/Requsts/Requsts"))
const AllUsers = React.lazy(() => import("./Dashboard/Admin/AllUsers/AllUsers"))
const ContractBookedDates = React.lazy(() =>
  import("./Dashboard/Host/ContractBookedDates/ContractBookedDates")
)
const BoatInfo = React.lazy(() => import("./Dashboard/Host/BoatInfo/BoatInfo"))
const AddFood = React.lazy(() => import("./Dashboard/Admin/AddFood/AddFood"))
const UpdateContract = React.lazy(() =>
  import("./Dashboard/Admin/UpdateContract/UpdateContract")
)

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"
import { useWeb3React } from "@web3-react/core"

export default function App() {
  const { active, chainId } = useWeb3React()

  const initialState = {
    food: {},
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "food":
        draft.food = action.value
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  return (
    <>
      {!active && (
        <div className="bg-indigo-600">
          <div className="max-w-7xl mx-auto py-1 px-3 sm:px-6 lg:px-8">
            <p className="ml-3 font-medium text-white text-center truncate">
              Connect your Wallet
            </p>
          </div>
        </div>
      )}
      {active && chainId !== 4 && (
        <div className="bg-red-600">
          <div className="max-w-7xl mx-auto py-1 px-3 sm:px-6 lg:px-8">
            <p className="ml-3 font-medium text-white text-center truncate">
              Please switch to network Ropsten, chainId (4)
            </p>
          </div>
        </div>
      )}
      <Header />
      <div className="main-root">
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <Routes>
              {/* Pages Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/listed-boats"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <Home />
                  </Suspense>
                }
              />
              <Route
                path="/Add-Whitelist-Address"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <AddWhitelistAddress />
                  </Suspense>
                }
              />
              <Route
                path="/Boat/:Contract"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <Boat />
                  </Suspense>
                }
              />
              <Route
                path="/Contract/:Contract/buy-nft"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <BuyForm />
                  </Suspense>
                }
              />
              <Route
                path="/Contract/:Contract/Booking-form/:id"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <BookingForm />
                  </Suspense>
                }
              />
              <Route path="/BoatInfo/:Contract" element={<BoatInfo />} />
              <Route
                path="/ContractInfo/:Contract/booked-dates"
                element={<ContractBookedDates />}
              />
              <Route path="/create-new" element={<CreateNew />} />
              <Route
                path="/about"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <About />
                  </Suspense>
                }
              />
              <Route
                path="/list-boat"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <ListBoat />
                  </Suspense>
                }
              />
              <Route
                path="/requsts"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <Requsts />
                  </Suspense>
                }
              />
              <Route
                path="/booked-dates"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <BookedDates />
                  </Suspense>
                }
              />
              <Route
                path="/all-users"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <AllUsers />
                  </Suspense>
                }
              />

              {/* Dashboard Routes */}
              <Route
                path="/Contract/:Contract/nft/:id"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <NFT />
                  </Suspense>
                }
              />
              <Route
                path="/offers-received"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <OffersReceived />
                  </Suspense>
                }
              />
              <Route
                path="/booked-date"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <BookedDate />
                  </Suspense>
                }
              />
              <Route
                path="/offers-made"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <OffersMade />
                  </Suspense>
                }
              />
              <Route
                path="/your-nfts"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <Collected />
                  </Suspense>
                }
              />
              <Route
                path="/Boats"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <Boats />
                  </Suspense>
                }
              />
              <Route
                path="/nft"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <NFT />
                  </Suspense>
                }
              />
              <Route
                path="/add-food"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <AddFood />
                  </Suspense>
                }
              />
              <Route
                path="/update-contract"
                element={
                  <Suspense fallback={<div>Loading</div>}>
                    <UpdateContract />
                  </Suspense>
                }
              />
            </Routes>
          </DispatchContext.Provider>
        </StateContext.Provider>
      </div>
      <Footer />
    </>
  )
}
