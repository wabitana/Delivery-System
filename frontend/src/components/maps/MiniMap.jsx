import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

export function MiniMap({ lat, lng, label = "Location", className = "", height = 200 }) {
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [lat, lng]);

  if (lat == null || lng == null || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-white/20 bg-white/40 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-400 ${className}`}
        style={{ height }}
      >
        Pin location on your storefront post to unlock the live map preview.
      </div>
    );
  }

  const center = [Number(lat), Number(lng)];

  return (
    <div className={`overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 ${className}`} style={{ height }}>
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
        <Marker position={center}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
