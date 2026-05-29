"use client";

import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  GeoJSON,
} from "react-leaflet";

import L from "leaflet";

import {
  useEffect,
  useState,
} from "react";

// =========================
// FIX LEAFLET ICON
// =========================
interface DefaultIconPrototype {
  _getIconUrl?: string;
}

delete (
  L.Icon.Default.prototype as DefaultIconPrototype
)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// =========================
// TYPE
// =========================
type StoreLocation = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  operationalStatus: string;
};

// =========================
// COMPONENT
// =========================
export default function CountryMap() {

  const [geoData, setGeoData] =
    useState(null);

  const [locations, setLocations] =
    useState<StoreLocation[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD GEOJSON
  // =========================
  useEffect(() => {

    fetch("/maps/deli-serdang.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      });

  }, []);

  // =========================
  // LOAD STORE LOCATION
  // =========================
  useEffect(() => {

    const loadStores = async () => {

      try {

        const response = await fetch(
         `${process.env.NEXT_PUBLIC_API_URL}/stores`,
          {
            cache: "no-store",
            credentials: "include",
          }
        );

        const data =
          await response.json();

        // FILTER YANG PUNYA KOORDINAT
        const filtered =
          data.filter(
            (item: StoreLocation) =>
              item.latitude &&
              item.longitude
          );

        setLocations(filtered);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    loadStores();

  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-gray-200 bg-white">
        <p className="text-sm text-gray-500">
          Loading maps...
        </p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[3.548, 98.82]}
      zoom={10}
      scrollWheelZoom={false}
      className="h-full w-full rounded-xl z-0"
    >

      {/* ========================= */}
      {/* BASE MAP */}
      {/* ========================= */}
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ========================= */}
      {/* BATAS WILAYAH */}
      {/* ========================= */}
      {geoData && (
        <GeoJSON
          data={geoData}
          interactive={false}
          style={() => ({
            color: "#2563eb",
            weight: 4,
            fillOpacity: 0,
          })}
        />
      )}

      {/* ========================= */}
      {/* STORE MARKERS */}
      {/* ========================= */}
      {locations.map((location) => (

        <CircleMarker
          key={location.id}
          center={[
            location.latitude,
            location.longitude,
          ]}
          radius={10}
          pathOptions={{
            color:
              location.operationalStatus ===
              "ONLINE"
                ? "#22c55e"
                : location.operationalStatus ===
                  "OFFLINE"
                ? "#ef4444"
                : "#f59e0b",

            fillColor:
              location.operationalStatus ===
              "ONLINE"
                ? "#22c55e"
                : location.operationalStatus ===
                  "OFFLINE"
                ? "#ef4444"
                : "#f59e0b",

            fillOpacity: 1,
            weight: 2,
          }}
        >

          <Popup>

            <div className="space-y-1 text-sm">

              <div className="font-semibold">
                {location.name}
              </div>

              <div>
                Status:
                {" "}
                <span
                  className={
                    location.operationalStatus ===
                    "ONLINE"
                      ? "text-green-600"
                      : location.operationalStatus ===
                        "OFFLINE"
                      ? "text-red-500"
                      : "text-yellow-600"
                  }
                >
                  {
                    location.operationalStatus
                  }
                </span>
              </div>

              <div className="text-xs text-gray-500">
                Lat:
                {" "}
                {location.latitude}
              </div>

              <div className="text-xs text-gray-500">
                Lng:
                {" "}
                {location.longitude}
              </div>

            </div>

          </Popup>

        </CircleMarker>
      ))}
    </MapContainer>
  );
}