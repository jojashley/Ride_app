import {View, Text, Image, ActivityIndicator, TouchableOpacity, FlatList,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import React, {useCallback, useEffect, useState} from "react";
import { useLocationStore } from "@/store";
import { useUser } from "@clerk/clerk-expo";
import {router, useFocusEffect} from "expo-router";
import * as Location from "expo-location";
import { Ride } from "@/types/type";
import CustomButton from "@/components/CustomButton";
import { useTranslation } from 'react-i18next';

const transformRidesData = (data: any[]): Ride[] => {
  return data.map((item, index) => ({
    ride_id: item.ride_id,
    origin_address: item.origin_address,
    destination_address: item.destination_address,
    origin_latitude: parseFloat(item.origin_latitude), // Convierte a número
    origin_longitude: parseFloat(item.origin_longitude), // Convierte a número
    destination_latitude: parseFloat(item.destination_latitude), // Convierte a número
    destination_longitude: parseFloat(item.destination_longitude), // Convierte a número
    ride_time: parseInt(item.ride_time, 10), // Convierte a número entero
    departure_time: item.departure_time,
    fare_price: parseFloat(item.fare_price), // Convierte a número
    payment_status: item.payment_status,
    driver_id: item.driver_id,
    user_email: item.user_email,
    created_at: item.created_at,
    driver: {
      first_name: item.driver_name.trim(), // Eliminar espacios en blanco
      last_name: item.driver_last_name.trim(), // Eliminar espacios en blanco
      car_seats: item.car_seats, // Asumimos que car_seats ya es un número
    },
  }));
};

const Rides = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { user } = useUser();
  const loading = false;
  const [hasPermissions, setHasPermissions] = useState(false);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const { t } = useTranslation();

  const requestLocation = async () => {
    const response = await fetch("/(api)/getRidesClients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.emailAddresses[0].emailAddress,
      }),
    });
    if (!response.ok) {
      throw new Error("Error al obtener el rol");
    }
    const data = await response.json();
    const filteredRides = transformRidesData(data.data);
    setRecentRides(filteredRides);

    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      setHasPermissions(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync();

    const address = await Location.reverseGeocodeAsync({
      latitude: location.coords?.latitude!,
      longitude: location.coords?.longitude!,
    });

    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: `${address[0].name} ${address[0].name}`,
    });
  };

  useEffect(() => {
    requestLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Llamar inmediatamente la primera vez
      requestLocation();

      // Crear un intervalo para actualizar los datos cada 5 segundos
      const interval = setInterval(() => {
        requestLocation();
      }, 5000);

      // Limpiar el intervalo cuando la pantalla pierde el foco
      return () => clearInterval(interval);
    }, [requestLocation])
  );

  return (
    <SafeAreaView>
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => (
          <View className="mb-2">
            <RideCard ride={item} />
          </View>
        )}
        className="p-5"
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{
          paddingBottom: 100,
        }}

        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm">{t('noRidesFound')}</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              {t('yourRides')}
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Rides;