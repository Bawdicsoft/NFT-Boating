import * as React from 'react';
import { Button, Container } from "react-bootstrap";
import Navbarr from './Navbar'
import "./header.css";

export const Home = () => { 

  return (<>
    <div id="banner-image">
      
    <Navbarr/>
      <Container id="container">
        <h1>RENT A YACHT</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, inventore.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>

        <Button> BOOK NOW </Button>


      </Container>

    </div >

  </>);
};
