import { Text, View } from "react-native";
import { useDriverStore, useLocationStore, useRideStore } from "@/store";
import RideLayout from "@/components/RideLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import React from "react";
import { fetchAPI } from "@/lib/fetch";
import { Ride, Driver } from "@/types/type";

const transformDriverData = (data: any[]): Driver[] => {
    return data.map((item, index) => ({
        driver_id: item.driver_id,
        first_name: item.driver_name.trim(),
        last_name: item.driver_last_name.trim(),
        profile_image_url:
            "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
        car_image_url:
            "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
        car_seats: item.car_seats,
        rating: 5,
    }));
};

const FindRide = () => {
    const { setDrivers } = useDriverStore();
    const { setRides } = useRideStore();
    const {
        userAddress,
        destinationAddress,
        setDestinationLocation,
        setUserLocation,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
    } = useLocationStore();

    const handleOnPress = async () => {
        try {
            const response = await fetchAPI("/(api)/getRidesUsers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    origin_latitude: userLatitude,
                    origin_longitude: userLongitude,
                    destination_latitude: destinationLatitude,
                    destination_longitude: destinationLongitude,
                }),
            });
            const result = response.data;
            setRides(result);
            const drivers = transformDriverData(result);
            console.log(drivers);
            setDrivers(drivers);
            router.push("/(root)/confirm-ride");
        } catch (error) {
            console.log("Error:", error.message);
        }
    };
    return (
        <RideLayout title="Ride" snapPoints={["85%"]}>
            <View className="my-3">
                <Text className="text-lg font-JakartaSemiBold mb-3">From</Text>
                <GoogleTextInput
                    icon={icons.target}
                    initialLocation={userAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="#f5f5f5"
                    handlePress={(location) => setUserLocation(location)}
                />
            </View>

            <View className="my-3">
                <Text className="text-lg font-JakartaSemiBold mb-3">To</Text>
                <GoogleTextInput
                    icon={icons.map}
                    initialLocation={destinationAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="transparent"
                    handlePress={(location) => setDestinationLocation(location)}
                />
            </View>

            <CustomButton title="Find now" onPress={handleOnPress} className="mt-5" />
        </RideLayout>
    );
};

export default FindRide;