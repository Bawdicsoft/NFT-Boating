import React, { useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { useState } from "react";
import { useImmer } from "use-immer";
import axios from "axios";

export default function Map({ address }) {
  const [state, setState] = useImmer({
    lat: 25.761681,
    lng: -80.191788,
    address: null,
  });

  useEffect(() => {
    const runMap = async () => {
      //   console.log(process.env.REACT_APP_MAPKEY, "process.env.MAPKEY")
      try {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_MAPKEY}`
        );

        if (res.data.status === "OK") {
          console.log("OK");
          console.log(res.data.results[0].geometry.location.lat);
          setState((e) => {
            e.lat = res.data.results[0].geometry.location.lat;
            e.lng = res.data.results[0].geometry.location.lng;
            e.address = address;
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    runMap();
  }, [address]);

  return (
    <div className="col-6" style={{ height: "350px" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: `${process.env.REACT_APP_MAPKEY}`,
        }}
        center={{
          lat: state.lat,
          lng: state.lng,
        }}
        defaultZoom={5}
      >
        <Marker lat={state.lat} lng={state.lng} address={state.address} />
      </GoogleMapReact>
    </div>
  );
}

const Marker = (props) => {
  const { address } = props;
  return (
    <>
      <div className="relative flex flex-col items-center group">
        <div
          className="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          fill="currentColor"
        >
          <div
            className={`pin`}
            style={{ backgroundColor: "red", cursor: "pointer" }}
            title={address}
          />
          <div className="pulse" />
        </div>
      </div>
    </>
  );
};
