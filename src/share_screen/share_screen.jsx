import { doc, getDoc } from "firebase/firestore";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { async } from "@firebase/util";

mapboxgl.accessToken = 'pk.eyJ1Ijoic2F0ZW5kcmExMjQxIiwiYSI6ImNreGc2MjI5cjFwaTQyd3BkeGZ6NWVhMHUifQ.Wh1LgnYc3GQFGCJ7l-C2tQ';

const SharePage = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);


  let path = window.location.href;
  let paths = path.split('/');
  let id = paths[paths.length - 1];
  const ref = doc(db, 'data', id);
  const [data, setData] = useState(null);
  const load_data = async () => {
    const document = await getDoc(ref);
    setData(document.data());
  }

  const initMap = () => {
    if (map.current) return; // initialize map only once
    console.log("init");
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  }
  useEffect(() => {
    initMap();
    load_data();
  }, []);
  useEffect(() => {
    if(!map.current) return;
    if(!data) return;
    map.current.addLayer({
      id: 'locations',
      type: 'circle',
      source: {
        type: 'geojson',
        data: data
      }
    });
  }, [data,map.current])
  return (
    <div>
      {
          <div>
            <div ref={mapContainer} className="map-container" style={{ height: "100vh" }} />
          </div>
      }
    </div>
  );
}

export default SharePage;