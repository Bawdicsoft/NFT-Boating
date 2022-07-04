import { Link } from "react-router-dom";
import "./Home.scss";
import React from "react";

function Home() {
  return (
    <div className="Home">
      <div className="Hero">
        <div className="Container">
          <h1>RENT A YACHT</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum,
            inventore. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <br />
          <Link to="/booking">Book Now</Link>
        </div>
      </div>

      <div className="Services">
        <div className="Container">
          <h2>Services</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit auctor,
            cursus nascetur odio nam gravida vehicula lacus
          </p>

          <div className="Grid">
            <div>
              <div className="Box"></div>
              <h5>Services</h5>
            </div>
            <div>
              <div className="Box"></div>
              <h5>Services</h5>
            </div>
            <div>
              <div className="Box"></div>
              <h5>Services</h5>
            </div>
          </div>
        </div>
      </div>

      <div className="instagram-feed">
        <div className="Container">
          <h2>Instagram Feed</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit auctor,
            cursus nascetur odio nam gravida vehicula lacus
          </p>
        </div>

        <div className="Grid">
          <div>
            <div className="Box"></div>
          </div>
          <div>
            <div className="Box"></div>
          </div>
          <div>
            <div className="Box"></div>
          </div>
          <div>
            <div className="Box"></div>
          </div>
          <div>
            <div className="Box"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
