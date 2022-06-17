import * as React from 'react';
import { Container } from "react-bootstrap";
import Navbarr from './Navbar'
import "./header.css";

export const Home = () => { 

  return (<>
    <div id="banner-image">
      
    <Navbarr/>
      <Container id="container">
        <h1>RENT A <br /> YACHT</h1>


      </Container>

    </div >

  </>);
};
