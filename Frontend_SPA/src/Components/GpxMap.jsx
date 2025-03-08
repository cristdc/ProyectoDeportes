import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import gpxParser from "gpxparser";

const GpxMap = ({ gpxUrl }) => {
  const [track, setTrack] = useState(null);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    const fetchGpx = async () => {
      try {
        const response = await fetch(gpxUrl, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Error al obtener el archivo GPX");
        }

        const gpxData = await response.text();
        const gpx = new gpxParser();
        gpx.parse(gpxData);

        if (gpx.tracks.length > 0) {
          const points = gpx.tracks[0].points.map((p) => [p.lat, p.lon]);
          setTrack(points);

          // Calcular los límites del mapa
          const lats = points.map((p) => p[0]);
          const lons = points.map((p) => p[1]);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLon = Math.min(...lons);
          const maxLon = Math.max(...lons);

          // Añadir un pequeño margen a los límites
          const latMargin = (maxLat - minLat) * 0.1;
          const lonMargin = (maxLon - minLon) * 0.1;

          setBounds([
            [minLat - latMargin, minLon - lonMargin],
            [maxLat + latMargin, maxLon + lonMargin],
          ]);
        }
      } catch (error) {
        console.error("Error al cargar el archivo GPX:", error);
      }
    };

    if (gpxUrl) {
      fetchGpx();
    }
  }, [gpxUrl]);

  if (!track || !bounds) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-gray-100 rounded-lg">
        <div className="text-gray-500">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        bounds={bounds}
        style={{ height: "400px", width: "100%" }}
        className="rounded-lg shadow-md"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={track} color="#9b9d79" weight={3} opacity={0.7} />
      </MapContainer>
    </div>
  );
};

export default GpxMap;
