import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const mapStyles = [
  { featureType: "all", elementType: "geometry", stylers: [{ visibility: "off" }] }, // Hide all elements
  { featureType: "administrative.province", elementType: "labels.text", stylers: [{ visibility: "on" }] }, // Show only state names
  { featureType: "administrative.province", elementType: "geometry", stylers: [{ visibility: "on" }] }, // Show state borders
  { featureType: "road", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#ffcc00" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "on" }] }
];

const defaultCenter = { lat: 28.6139, lng: 77.2090 };

const SearchUser = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBcqkHauBPftbJfbOVMWnn8AI4t6ShxBOI">
      <div style={{ height: "100vh", width: "100%", position: "relative" }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={defaultCenter}
          zoom={15}
          options={{ styles: mapStyles }}
        >
          <div style={{ position: "absolute", backgroundColor: "white", padding: "10px" }} className="flex justify-between items-center w-screen mt-5 gap-5">
            <span>AMIOX</span>
            <input type="text" placeholder="Search..." className="p-2 w-[500px] bg-gray-100" />
            <span>Filter</span>
          </div>
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default SearchUser;