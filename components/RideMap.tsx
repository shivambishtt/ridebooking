"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/lib/fixLeafletIcon";

interface RideMapProps {
  pickupPosition: [number, number];
  dropPosition?: [number, number];
}

const RideMap = ({ pickupPosition, dropPosition }: RideMapProps) => {
  const bounds = dropPosition ? [pickupPosition, dropPosition] : undefined;

  return (
    <MapContainer
      center={pickupPosition}
      bounds={bounds}
      zoom={50}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={pickupPosition}>
        <Popup>Pickup Location</Popup>
      </Marker>
      {dropPosition && (
        <Marker position={dropPosition}>
          <Popup>Drop Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default RideMap;
