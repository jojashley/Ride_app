import { Text, View } from "react-native";
import { useDriverStore, useLocationStore } from "@/store";
import RideLayout from "@/components/RideLayout";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import InputField from "@/components/InputField";
import React, { useState } from "react";
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";
import { useTranslation } from 'react-i18next';

const FindRide = () => {
    const { user } = useUser();
    const { userAddress, destinationAddress } = useLocationStore();
    const [userAdd, setUserAdd] = useState(userAddress);
    const { t } = useTranslation();
    const {
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
        setDestinationLocation,
        setUserLocation,
    } = useLocationStore();

    const [form, setForm] = useState({
        origin_address: "Origin",
        destination_address: "Destination",
        origin_latitude: "",
        origin_longitude: "",
        destination_latitude: "",
        destination_longitude: "",
        ride_time: "",
        departure_time: "",
        fare_price: "",
        payment_status: "pending",
        user_id: "1",
        created_at: "",
    });

    const handleFindRide = async () => {
        console.log("Form after update:", {
            origin_address: userAddress,
            destination_address: destinationAddress,
            origin_longitude: userLongitude,
            origin_latitude: userLatitude,
            destination_latitude: destinationLatitude,
            destination_longitude: destinationLongitude,
        });

        try {
            const response = await fetch("/(api)/getDriver", {
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
            let id_driver = data.data[0].id;

            await fetchAPI("/(api)/ride", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    origin_address: form.origin_address,
                    destination_address: form.destination_address,
                    origin_latitude: userLatitude,
                    origin_longitude: userLongitude,
                    destination_latitude: destinationLatitude,
                    destination_longitude: destinationLongitude,
                    ride_time: form.ride_time,
                    departure_time: form.departure_time,
                    fare_price: form.fare_price,
                    payment_status: form.payment_status,
                    user_id: id_driver,
                    created_at: new Date().toISOString(),
                }),
            });

            router.push("/(root-driver)/(tabs)/rides");
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    return (
        <RideLayout title="Ride" snapPoints={["55%", "93%"]}>
            <View className="my-1">
                <Text className="text-lg font-JakartaSemiBold mb-3">{t('from')}</Text>
                <GoogleTextInput
                    icon={icons.target}
                    initialLocation={userAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="#f5f5f5"
                    handlePress={(location) => {
                        console.log("Location Data:", location);
                        setUserLocation(location);
                        setForm(prevForm => ({
                            ...prevForm,
                            origin_address: location.address || 'TEC',
                            origin_longitude: location.longitude.toString(),
                            origin_latitude: location.latitude.toString(),
                        }));
                    }}
                />
            </View>

            <View className="my-1">
                <Text className="text-lg font-JakartaSemiBold mb-3">{t('to')}</Text>
                <GoogleTextInput
                    icon={icons.map}
                    initialLocation={destinationAddress!}
                    containerStyle="bg-neutral-100"
                    textInputBackgroundColor="transparent"
                    handlePress={(location) => {
                        console.log("Location Data:", location);
                        setUserLocation(location);
                        setForm(prevForm => ({
                            ...prevForm,
                            destination_address: location.address || 'Ciudad Quesada',
                            destination_longitude: location.longitude.toString(),
                            destination_latitude: location.latitude.toString(),
                        }));
                    }}
                />
            </View>

            <View className="my-1">
                <InputField
                    label={t('howMuch')}
                    icon={icons.money}
                    placeholder="12345"
                    value={form.fare_price}
                    keyboardType="numeric"
                    onChangeText={(value) => setForm({ ...form, fare_price: value })}
                />
            </View>
            <View className="my-1">
                <InputField
                    label={t('howLong')}
                    icon={icons.time}
                    placeholder="12345"
                    value={form.ride_time}
                    keyboardType="numeric"
                    onChangeText={(value) => setForm({ ...form, ride_time: value })}
                />
            </View>

            <View className="my-1">
                <InputField
                    label={t('departureTime')}
                    placeholder="12:30"
                    icon={icons.time}
                    value={form.departure_time}
                    onChangeText={(value) => setForm({ ...form, departure_time: value })}
                />
            </View>

            <CustomButton
                title="Find now"
                onPress={handleFindRide}
                className="mt-5"
            />
        </RideLayout>
    );
};

export default FindRide;
