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
const AddWhitelistAddress = React.lazy(() => import("./pages/ListBoat/ListBoat"))
const About = React.lazy(() => import("./pages/About/About"))

// Dashboard
const CreateNew = React.lazy(() => import("./Dashboard/Host/CreateNew/CreateNew"))
const OffersReceived = React.lazy(() => import("./Dashboard/User/OffersReceived/OffersReceived"))
const OffersMade = React.lazy(() => import("./Dashboard/User/OffersMade/OffersMade"))
const BookedDate = React.lazy(() => import("./Dashboard/User/BookedDate/BookedDate"))
const Collected = React.lazy(() => import("./Dashboard/User/Collected/Collected"))
const Boats = React.lazy(() => import("./Dashboard/Host/Boats/Boats"))
const NFT = React.lazy(() => import("./Dashboard/User/NFT/NFT"))
const BookedDates = React.lazy(() => import("./Dashboard/Admin/BookedDates/BookedDates"))
const Requsts = React.lazy(() => import("./Dashboard/Admin/Requsts/Requsts"))
const AllUsers = React.lazy(() => import("./Dashboard/Admin/AllUsers/AllUsers"))
const ContractBookedDates = React.lazy(() =>
  import("./Dashboard/Host/ContractBookedDates/ContractBookedDates")
)
const BoatInfo = React.lazy(() => import("./Dashboard/Host/BoatInfo/BoatInfo"))
const AddFood = React.lazy(() => import("./Dashboard/Admin/AddFood/AddFood"))
const UpdateContract = React.lazy(() => import("./Dashboard/Admin/UpdateContract/UpdateContract"))

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"
import { useWeb3React } from "@web3-react/core"
import TermsAndConditions from "./pages/TermsAndConditions"
import PrivacyPolicy from "./pages/PrivacyPolicy"

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

  const contractNetworkName = process.env.REACT_APP_CONTRACT_NETWORK_NAME
  const contractNetworkId = Number(process.env.REACT_APP_CONTRACT_NETWORK_ID)

  return (
    <>
      {active && chainId !== contractNetworkId && (
        <div className="bg-red-600">
          <div className="max-w-7xl mx-auto py-1 px-3 sm:px-6 lg:px-8">
            <p className="ml-3 font-medium text-white text-center truncate">
              Please switch to network {contractNetworkName}, chainId ({contractNetworkId})
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
                  <Suspense fallback={<Loading />}>
                    <Home />
                  </Suspense>
                }
              />
              <Route
                path="/Add-Whitelist-Address"
                element={
                  <Suspense fallback={<Loading />}>
                    <AddWhitelistAddress />
                  </Suspense>
                }
              />
              <Route
                path="/Boat/:Contract"
                element={
                  <Suspense fallback={<Loading />}>
                    <Boat />
                  </Suspense>
                }
              />
              <Route
                path="/terms-and-conditions"
                element={
                  <Suspense fallback={<Loading />}>
                    <TermsAndConditions />
                  </Suspense>
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <Suspense fallback={<Loading />}>
                    <PrivacyPolicy />
                  </Suspense>
                }
              />
              <Route
                path="/Contract/:Contract/buy-nft"
                element={
                  <Suspense fallback={<Loading />}>
                    <BuyForm />
                  </Suspense>
                }
              />
              <Route
                path="/Contract/:Contract/Booking-form/:id"
                element={
                  <Suspense fallback={<Loading />}>
                    <BookingForm />
                  </Suspense>
                }
              />
              <Route
                path="/BoatInfo/:Contract"
                element={
                  <Suspense fallback={<Loading />}>
                    <BoatInfo />
                  </Suspense>
                }
              />
              <Route
                path="/ContractInfo/:Contract/booked-dates"
                element={
                  <Suspense fallback={<Loading />}>
                    <ContractBookedDates />
                  </Suspense>
                }
              />
              <Route
                path="/create-new"
                element={
                  <Suspense fallback={<Loading />}>
                    <CreateNew />
                  </Suspense>
                }
              />
              <Route
                path="/about"
                element={
                  <Suspense fallback={<Loading />}>
                    <About />
                  </Suspense>
                }
              />
              <Route
                path="/list-boat"
                element={
                  <Suspense fallback={<Loading />}>
                    <ListBoat />
                  </Suspense>
                }
              />
              <Route
                path="/requsts"
                element={
                  <Suspense fallback={<Loading />}>
                    <Requsts />
                  </Suspense>
                }
              />
              <Route
                path="/booked-dates"
                element={
                  <Suspense fallback={<Loading />}>
                    <BookedDates />
                  </Suspense>
                }
              />
              <Route
                path="/all-users"
                element={
                  <Suspense fallback={<Loading />}>
                    <AllUsers />
                  </Suspense>
                }
              />

              {/* Dashboard Routes */}
              <Route
                path="/Contract/:Contract/nft/:id"
                element={
                  <Suspense fallback={<Loading />}>
                    <NFT />
                  </Suspense>
                }
              />
              <Route
                path="/offers-received"
                element={
                  <Suspense fallback={<Loading />}>
                    <OffersReceived />
                  </Suspense>
                }
              />
              <Route
                path="/booked-date"
                element={
                  <Suspense fallback={<Loading />}>
                    <BookedDate />
                  </Suspense>
                }
              />
              <Route
                path="/offers-made"
                element={
                  <Suspense fallback={<Loading />}>
                    <OffersMade />
                  </Suspense>
                }
              />
              <Route
                path="/your-nfts"
                element={
                  <Suspense fallback={<Loading />}>
                    <Collected />
                  </Suspense>
                }
              />
              <Route
                path="/Boats"
                element={
                  <Suspense fallback={<Loading />}>
                    <Boats />
                  </Suspense>
                }
              />
              <Route
                path="/nft"
                element={
                  <Suspense fallback={<Loading />}>
                    <NFT />
                  </Suspense>
                }
              />
              <Route
                path="/add-food"
                element={
                  <Suspense fallback={<Loading />}>
                    <AddFood />
                  </Suspense>
                }
              />
              <Route
                path="/update-contract"
                element={
                  <Suspense fallback={<Loading />}>
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

function Loading() {
  return (
    <div className="m-auto text-center w-max py-10">
      <p>Loading....</p>
    </div>
  )
}
