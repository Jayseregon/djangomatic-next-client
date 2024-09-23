"use client";

import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults = {
  zoom: 15,
};

const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom, posix } = Map;

  return (
    <MapContainer
      center={posix}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      zoom={zoom}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {/* <Marker position={posix} draggable={false}>
                <Popup>Hey ! I study here</Popup>
            </Marker> */}
      <Marker draggable={false} position={posix} />
    </MapContainer>
  );
};

export default Map;

// const MapComponent = () => {
//     const { dbName, schemaName, tableName } = useDbContext();
//     const { data, loading, error } = useFetchTableData(dbName, schemaName, tableName);

//     useEffect(() => {
//       if (error) {
//         console.error("Error fetching data:", error);
//       }
//     }, [error]);

//     return (
//       <div>
//         {loading && <p>Loading...</p>}
//         {error && <p>Error: {error}</p>}
//         <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "500px", width: "100%" }}>
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
//           {data && <GeoJSON data={data} />}
//         </MapContainer>
//       </div>
//     );
//   };

//   export default MapComponent;
