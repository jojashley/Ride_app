import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useDriverStore, useLocationStore } from "@/store";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useEffect, useState } from "react";
import { MarkerData } from "@/types/type";
import { icons } from "@/constants";

const Map = () => {
    const {
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude,
    } = useLocationStore();
    const { selectedDriver, setDrivers, drivers } = useDriverStore();
    const [markers, setMarkers] = useState<MarkerData[]>([]);

    const region = calculateRegion({
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude,
    });

    useEffect(() => {
        if (Array.isArray(drivers)) {
            if (!userLatitude || !userLongitude) return;
            const newMarkers = generateMarkersFromData({
                data: drivers,
                userLongitude,
                userLatitude,
            });

            setMarkers(newMarkers);
        }
    }, [drivers]);

    return (
        <MapView
            provider={PROVIDER_DEFAULT}
            className="w-full h-full rounded-2xl"
            tintColor="black"
            mapStyle="mutedStandard"
            showsVerticalScrollIndicator={false}
            initialRegion={region}
            showsUserLocation={true}
            userInterfaceStyle="light"
        >
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                    }}
                    title={marker.title}
                    image={
                        selectedDriver === marker.id ? icons.selectedMarker : icons.marker
                    }
                />
            ))}
        </MapView>
    );
};

export default Map;