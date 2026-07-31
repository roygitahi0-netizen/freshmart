import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Leaflet's default marker icons don't resolve correctly under Vite's
// bundler by default — this re-registers them explicitly.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Store coordinates — update to your real location, or swap this
// component for the Google Maps Embed API if you have an API key
// (see README.md "Using Google Maps instead" section).
const STORE_POSITION = [-1.2833, 36.8236]; // Moi Avenue, Nairobi
const STORE_NAME = "Fresh Mini Mart";

export default function StoreMap() {
  return (
    <div className="rounded-lg overflow-hidden border border-market-green/15 shadow-crate h-80 sm:h-96">
      <MapContainer
        center={STORE_POSITION}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={STORE_POSITION}>
          <Popup>{STORE_NAME} — Moi Avenue, Nairobi</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
