import { useState } from "react";
import { Button } from "react-bootstrap";
import { Header } from "./components/Header/Header";
import  Booking  from "./components/Booking/Booking";
function App() {

  return (
    <>
      <Header />
      <Booking />
    </>
  );
}

export default App;
