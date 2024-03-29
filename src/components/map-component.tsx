import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
import { FC, useCallback, useEffect, useState } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MapProps {
  containerStyle?: React.CSSProperties;
  coordinate: Coordinates;
  coordinates?: Coordinates[];
  className?: string;
}

const MapComponent: FC<MapProps> = ({
  containerStyle,
  coordinates,
  coordinate,
  className,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map",
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY ?? "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && (coordinates?.length ?? 0) > 0) {
      const bounds = new google.maps.LatLngBounds();
      coordinates?.forEach((coord) => {
        bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
      });
      map.fitBounds(bounds);
    }
  }, [map, coordinates]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      mapContainerClassName={className || ""}
      center={{ lat: coordinate.lat, lng: coordinate.lng }}
      zoom={20}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM, // position of the zoom control
        },
        disableDefaultUI: true,
      }}
    >
      {coordinates &&
        coordinates.map((coord, index) => (
          <Marker key={index} position={{ lat: coord.lat, lng: coord.lng }} />
        ))}

      {/* Child components, such as markers, info windows, etc. */}
      {/* add custom zoom button */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1.5">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-[40px] border bg-white text-xl text-black shadow-md duration-100 hover:bg-zinc-50 active:scale-95"
          onClick={() => {
            if (map?.getZoom() === 20) return;
            if (map) {
              if (map) {
                map.setZoom((map.getZoom() ?? 0) + 1);
              }
            }
          }}
        >
          +
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-[40px] border bg-white text-xl text-black shadow-md duration-100 hover:bg-zinc-50 active:scale-95"
          onClick={() => {
            if (map?.getZoom() === 1) return;
            if (map) {
              if (map) {
                map.setZoom((map.getZoom() ?? 0) - 1);
              }
            }
          }}
        >
          -
        </button>
      </div>

      {coordinate && (
        <>
          <Marker
            onClick={() => {
              map?.setZoom(20);
              map?.setCenter({ lat: coordinate.lat, lng: coordinate.lng });
            }}
            position={{ lat: coordinate.lat, lng: coordinate.lng }}
          />
        </>
      )}
    </GoogleMap>
  ) : (
    <div className="flex h-full w-full items-center justify-center px-5 py-10">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
};

export default MapComponent;
