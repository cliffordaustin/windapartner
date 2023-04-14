import { useState } from "react";
import { Icon } from "@iconify/react";
import Mapbox, { Marker, NavigationControl } from "react-map-gl";

type MapProps = {
  longitude: number;
  latitude: number;
};

export default function Map({ longitude, latitude }: MapProps) {
  const [viewState, setViewState] = useState({
    longitude: longitude,
    latitude: latitude,
    zoom: 6,
  });

  return (
    <div className="w-full h-full relative">
      <style jsx global>
        {`
          .mapboxgl-map {
            -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
          }
          .mapboxgl-popup-content {
            background: none;
            box-shadow: none !important;
          }
          .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
            border-top-color: transparent !important;
            border: none !important;
          }
        `}
      </style>
      {/* <Mapbox
        scrollZoom={false}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        initialViewState={{
          longitude: longitude,
          latitude: latitude,
          zoom: 6,
        }}
      >
        <Marker longitude={longitude} latitude={latitude}>
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
            <Icon icon="fa6-solid:house" className="text-white w-6 h-6" />
          </div>
        </Marker>
      </Mapbox> */}

      <Mapbox
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 6,
        }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker longitude={-100} latitude={40} color="#000" scale={2} />
      </Mapbox>
    </div>
  );
}
