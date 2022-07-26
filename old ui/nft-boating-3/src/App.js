import { Route, Routes } from "react-router-dom";
import "./App.scss";
import React from "react";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import OffersReceived from "./pages/Dashboard/OffersReceived/OffersReceived";
import BookedDates from "./pages/Dashboard/BookedDates/BookedDates";
import OffersMade from "./pages/Dashboard/OffersMade/OffersMade";
import OwnerShips from "./pages/Dashboard/OwnerShips/OwnerShips";

import SinglePage from "./pages/SinglePage/SinglePage";
import Booking from "./pages/Booking/Booking";
import BuyNFT from "./pages/BuyNFT/BuyNFT";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/become-a-member" element={<BuyNFT />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/single-page/:id" element={<SinglePage />} />

        <Route path="/owner-ships" element={<OwnerShips />} />
        <Route path="/booked-Dates" element={<BookedDates />} />
        <Route path="/offers-made" element={<OffersMade />} />
        <Route path="/offers-received" element={<OffersReceived />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
