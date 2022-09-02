import { Route, Routes } from "react-router-dom"

// Comp
import Header from "./Comp/Header/Header"
import Footer from "./Comp/Footer/Footer"

// Pages
import Home from "./pages/Home/Home"
import BuyForm from "./pages/BuyForm/BuyForm"
import BookingForm from "./pages/BookingForm/BookingForm"
import Boat from "./pages/Boat/Boat"
import ListBoat from "./pages/ListBoat/ListBoat"
import AddWhitelistAddress from "./pages/AddWhitelistAddress/AddWhitelistAddress"
import About from "./pages/About/About"

// Dashboard
import CreateNew from "./Dashboard/Host/CreateNew/CreateNew"
import OffersReceived from "./Dashboard/User/OffersReceived/OffersReceived"
import OffersMade from "./Dashboard/User/OffersMade/OffersMade"
import BookedDate from "./Dashboard/User/BookedDate/BookedDate"
import Collected from "./Dashboard/User/Collected/Collected"
import Boats from "./Dashboard/Host/Boats/Boats"
import NFT from "./Dashboard/User/NFT/NFT"
import BookedDates from "./Dashboard/Admin/BookedDates/BookedDates"
import Requsts from "./Dashboard/Admin/Requsts/Requsts"
import AllUsers from "./Dashboard/Admin/AllUsers/AllUsers"
import ContractBookedDates from "./Dashboard/Host/ContractBookedDates/ContractBookedDates"
import BoatInfo from "./Dashboard/Host/BoatInfo/BoatInfo"
import LandingPage from "./pages/LandingPage/LandingPage"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"
import HeaderBanner from "./Comp/HeaderBanner/HeaderBanner"
import AddFood from "./Dashboard/Admin/AddFood/AddFood"
import UpdateContract from './Dashboard/Admin/UpdateContract/UpdateContract'

export default function App() {
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
      {typeof window.ethereum === "undefined" && <HeaderBanner />}
      <Header />
      <div className="main-root">
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <Routes>
              {/* Pages Routes */}
              <Route path="/listed-boats" element={<Home />} />
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/Add-Whitelist-Address"
                element={<AddWhitelistAddress />}
              />
              <Route path="/Boat/:Contract" element={<Boat />} />
              <Route path="/Contract/:Contract/buy-nft" element={<BuyForm />} />
              <Route
                path="/Contract/:Contract/Booking-form/:id"
                element={<BookingForm />}
              />
              <Route path="/BoatInfo/:Contract" element={<BoatInfo />} />
              <Route
                path="/ContractInfo/:Contract/booked-dates"
                element={<ContractBookedDates />}
              />
              <Route path="/create-new" element={<CreateNew />} />
              <Route path="/about" element={<About />} />
              <Route path="/list-boat" element={<ListBoat />} />
              <Route path="/requsts" element={<Requsts />} />
              <Route path="/booked-dates" element={<BookedDates />} />
              <Route path="/all-users" element={<AllUsers />} />

              {/* Dashboard Routes */}
              <Route path="/Contract/:Contract/nft/:id" element={<NFT />} />
              <Route path="/offers-received" element={<OffersReceived />} />
              <Route path="/booked-date" element={<BookedDate />} />
              <Route path="/offers-made" element={<OffersMade />} />
              <Route path="/your-nfts" element={<Collected />} />
              <Route path="/Boats" element={<Boats />} />
              <Route path="/nft" element={<NFT />} />
              <Route path="/add-food" element={<AddFood />} />
              <Route path="/update-contract" element={<UpdateContract />} />
            </Routes>
          </DispatchContext.Provider>
        </StateContext.Provider>
      </div>
      <Footer />
    </>
  )
}
