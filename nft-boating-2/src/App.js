import { Route, Routes } from "react-router-dom"

// Comp
import Header from "./Comp/Header/Header"
import Footer from "./Comp/Footer/Footer"

// Pages
import Home from "./pages/Home/Home"
import BuyForm from "./pages/BuyForm/BuyForm"
import BookingForm from "./pages/BookingForm/BookingForm"
import Contract from "./pages/Contract/Contract"

// Dashboard
import OffersReceived from "./Dashboard/OffersReceived/OffersReceived"
import OffersMade from "./Dashboard/OffersMade/OffersMade"
import BookedDate from "./Dashboard/BookedDate/BookedDate"
import Collected from "./Dashboard/Collected/Collected"
import Created from "./Dashboard/Created/Created"
import CreateNew from "./pages/CreateNew/CreateNew"
import NFT from "./Dashboard/NFT/NFT"
import About from "./pages/About/About"
import AddWhitelistAddress from "./pages/AddWhitelistAddress/AddWhitelistAddress"

export default function App() {
  return (
    <>
      <Header />
      <div className="main-root">
        <Routes>
          {/* Pages Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/Add-Whitelist-Address"
            element={<AddWhitelistAddress />}
          />
          <Route path="/Contract/:Contract" element={<Contract />} />
          <Route path="/Contract/:Contract/buy-nft" element={<BuyForm />} />
          <Route
            path="/Contract/:Contract/Booking-form/:id"
            element={<BookingForm />}
          />
          <Route path="/create-new" element={<CreateNew />} />
          <Route path="/about" element={<About />} />

          {/* Dashboard Routes */}
          <Route path="/Contract/:Contract/nft/:id" element={<NFT />} />
          <Route path="/offers-received" element={<OffersReceived />} />
          <Route path="/booked-date" element={<BookedDate />} />
          <Route path="/offers-made" element={<OffersMade />} />
          <Route path="/collected" element={<Collected />} />
          <Route path="/created" element={<Created />} />
          <Route path="/nft" element={<NFT />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}
