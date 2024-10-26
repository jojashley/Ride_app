import {useAuth, useUser} from '@clerk/clerk-expo'
import * as Location from 'expo-location'
import {FlatList, Text, View, Image, ActivityIndicator, TouchableOpacity} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import RideCard from "@/components/RideCard";
import {icons, images} from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import {useLocationStore} from "@/store";
import {useEffect, useState} from "react";
import {router} from "expo-router";
import {Ride} from "@/types/type";
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

export default function Page() {
    const { setUserLocation, setDestinationLocation } = useLocationStore();
    const { user } = useUser()
    const loading = false;

    const [recentRides, setRecentRides] = useState<Ride[]>([]);
    const [hasPermissions, setHasPermissions] = useState(false);
    const { signOut } = useAuth();
    const { t } = useTranslation();

    const handleSignOut = () => {
        signOut();
        router.replace("/(auth)/sign-in");
    };

    const handelDestinationPress = (location: {
        latitude: number;
        longitude: number;
        address: string;
    }) => {
        setDestinationLocation(location);

        router.push("/(root-driver)/find-ride");
    };

    useEffect(() => {
        const requestLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if(status !== 'granted'){
                setHasPermissions(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync();

            const address =  await Location.reverseGeocodeAsync({
               latitude: location.coords?.latitude!,
               longitude: location.coords?.longitude!,
            });

            setUserLocation({
                //latitude: location.coords.latitude,
                //longitude: location.coords.longitude,
                latitude: 37.78825,
                longitude: -122.4324,
                address: `${address[0].name}, ${address[0].region}`,
            });
        };

        requestLocation();

        const recentRidess = async () => {
            const response = await fetch("/(api)/getRidesDriver", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.emailAddresses[0].emailAddress,
                }),
            });

            if (!response.ok) {
                throw new Error("Error al obtener el rol");
            }
            const data = await response.json();
            const filteredRides = transformRidesData(data.data).filter(ride => ride.payment_status !== "pending");
            setRecentRides(filteredRides);
        }
        recentRidess()
    },[]);

    return (
        <SafeAreaView className={"bg-general-500"}>
            <FlatList
                data={recentRides?.slice(0,5)}
                //data={[]}
                renderItem={({ item } ) => <RideCard ride={item} />}
                className="px-5"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingTop: 100,
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
                                <Text className="text-sm">{t('noRecentRides')}</Text>
                            </>
                        ): (
                            <ActivityIndicator size="small" color="#000" />
                        )}
                    </View>
                )}
                ListHeaderComponent={() =>(
                    <>
                        <View className="flex flex-row items-center justify-between my-5">
                            <Text className="text-2xl capitalize font-JakartaExtraBold">
                                {t('welcome')}, {user?.firstName || user?.emailAddresses[0].emailAddress.split("@")[0]}{" "}
                            </Text>
                            <TouchableOpacity onPress={handleSignOut} className="justify-center items-center w-10 h-10 rounded-full bg-white">
                                <Image source={icons.out} className="w-4 h-4"/>
                            </TouchableOpacity>
                        </View>

                        <GoogleTextInput
                            icon={icons.search}
                            containerStyle="bg-white shadow-md shadow-neutral-300"
                            handlePress={handelDestinationPress}
                        />

                        <>
                            <Text className="text-xl font-JakartaBold mt-5 mb-3">
                                {t('yourCurrentLocation')}
                            </Text>
                            <View className="flex flex-row items-center bg-transparent h-[300px]">
                                <Map />
                            </View>
                        </>
                        <Text className="text-xl font-JakartaBold mt-5 mb-3">
                            {t('recentRides')}
                        </Text>
                    </>
                )}
            />
        </SafeAreaView>
    )
}