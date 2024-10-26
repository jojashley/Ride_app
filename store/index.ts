import { create } from "zustand";
import {DriverStore, LocationStore, MarkerData, RideStore, RideData} from "@/types/type";

export const useLocationStore = create<LocationStore>((set) => ({
    userAddress: null,
    userLongitude: null,
    userLatitude: null,
    destinationLongitude: null,
    destinationLatitude: null,
    destinationAddress: null,
    setUserLocation: ({latitude, longitude, address}: {
        latitude : number, longitude: number, address: string }) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address
        }));
    },
    setDestinationLocation: ({latitude, longitude, address}: {
        latitude : number, longitude: number, address: string }) => {
        set(() => ({
            destinationLatitude: latitude,
            destinationLongitude: longitude,
            destinationAddress: address
        }));
    },
}));

export const useDriverStore = create<DriverStore>((set) => ({
    drivers: [] as MarkerData[],
    selectedDriver: null,
    setSelectedDriver: (driverId: number) =>
        set(() => ({ selectedDriver: driverId })),
    setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers: drivers })),
    clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));

// Define la tienda para almacenar y gestionar los rides
export const useRideStore = create<RideStore>((set) => ({
    rides: [] as RideData[], // Lista inicial vacía de rides
    selectedRide: null, // Ride seleccionado, inicialmente nulo

    // Función para agregar un nuevo ride
    addRide: (newRide: RideData) =>
      set((state) => ({ rides: [...state.rides, newRide] })),

    // Función para establecer la lista de rides
    setRides: (rides: RideData[]) =>
      set(() => ({ rides: rides })),

    // Función para seleccionar un ride por su ID
    setSelectedRide: (rideId: number) =>
      set((state) => ({
          selectedRide: state.rides.find((ride) => ride.driver_id === rideId) || null
      })),

    // Función para limpiar el ride seleccionado
    clearSelectedRide: () =>
      set(() => ({ selectedRide: null })),
}));
