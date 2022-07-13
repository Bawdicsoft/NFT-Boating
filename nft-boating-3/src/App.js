import { Route, Routes } from "react-router-dom";
import "./App.scss";
import React from "react";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import SinglePage from "./pages/SinglePage/SinglePage";
import Dashboard from "./pages/Dashboard/Dashboard";
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/single-page/:id" element={<SinglePage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
