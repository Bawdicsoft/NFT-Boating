import { useState } from "react";
import { Button } from "react-bootstrap";
import { Header } from "./components/Header/Home";
import  Booking  from "./components/Booking/Booking";
import RouteConfig from './components/Router/Router'
function App() {

  return (
    <div>
     <RouteConfig/>
    </div>
  );
}

export default App;
