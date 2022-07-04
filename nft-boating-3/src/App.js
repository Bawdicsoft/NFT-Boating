import { Route, Routes } from "react-router-dom";
import "./App.scss";
import React from "react";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

// import Booking from "./pages/Booking/Booking";
import BuyNFT from "./pages/BuyNFT/BuyNFT";
import Home from "./pages/Home/Home";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/BuyNFT" element={<BuyNFT />} />
        {/* <Route path="/booking" element={<Booking />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
