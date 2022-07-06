import { Link } from "react-router-dom";
import "./Home.scss";
import React from "react";
import yachtImg from "../../Assets/Img/yachat.jpg";
import weddingImg from "../../Assets/Img/wedding.jpg";
import fishingImg from "../../Assets/Img/fishing.jpg";
import cateringImg from "../../Assets/Img/catering.jpg";

import image1 from "../../Assets/Img/Instagram Feed/image1.jpg";
import image2 from "../../Assets/Img/Instagram Feed/image2.jpg";
import image3 from "../../Assets/Img/Instagram Feed/image3.jpg";
import image4 from "../../Assets/Img/Instagram Feed/image4.jpg";
import image5 from "../../Assets/Img/Instagram Feed/image5.jpg";

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
              <div style={{backgroundImage: `url(${yachtImg})`}} className="Box">
                {/* <img width="50px" src={fishingImg} alt="" srcset="" /> */}
              </div>
              <h5>Yacht</h5>
            </div>
            <div>
              <div style={{backgroundImage: `url(${weddingImg})`}} className="Box"></div>
              <h5>Wedding</h5>
            </div>
            <div>
              <div style={{backgroundImage: `url(${fishingImg})`}} className="Box"></div>
              <h5>Fishing</h5>
            </div>
            <div>
              <div style={{backgroundImage: `url(${cateringImg})`}} className="Box"></div>
              <h5>Catering</h5>
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
            <div style={{backgroundImage: `url(${image1})`}} className="Box"></div>
          </div>
          <div>
            <div style={{backgroundImage: `url(${image2})`}} className="Box"></div>
          </div>
          <div>
            <div style={{backgroundImage: `url(${image3})`}} className="Box"></div>
          </div>
          <div>
            <div style={{backgroundImage: `url(${image4})`}} className="Box"></div>
          </div>
          <div>
            <div style={{backgroundImage: `url(${image5})`}} className="Box"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
