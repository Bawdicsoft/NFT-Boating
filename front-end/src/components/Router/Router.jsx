import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbarr from '../Header/Navbar'
import {Home} from '../Header/Home';
import OwnerShip from '../OwnerShip/OwnerShip';
import Booking from "../Booking/Booking";

const RouteConfig = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/ownership" element={<OwnerShip />}></Route>
                <Route path="/booking" element={<Booking />}></Route>
            </Routes>
        </div>
    );
}

export default RouteConfig;
