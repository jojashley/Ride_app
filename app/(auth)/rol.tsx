import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { icons, images } from "@/constants";

const RolPage = () => {
    return (
        <ScrollView className="bg-general-500">
            <View className="flex flex-col bg-white justify-center items-center">
                <Image
                    source={images.onboarding3}
                    className="w-full h-[400px] mt-[70px]"
                    alt="No recent rides found"
                    resizeMode="contain"
                />
                <Text className="text-2xl capitalize mt-10 font-JakartaSemiBold">
                    Select your role in Ride App
                </Text>
                <CustomButton
                    title="Passenger"
                    onPress={() => router.replace("/(auth)/sign-up")}
                    className="mt-10 text-2xl"
                    IconLeft={() => (
                        <Image
                            source={icons.person}
                            resizeMode="contain"
                            className="w-5 h-5 mx-2"
                        />
                    )}
                />
                <CustomButton
                    title="Driver"
                    onPress={() => router.replace("/(auth)/sign-up-driver")}
                    className="mt-6"
                    IconLeft={() => (
                        <Image
                            source={icons.star}
                            resizeMode="contain"
                            className="w-5 h-5 mx-2"
                        />
                    )}
                />
            </View>
        </ScrollView>
    );
};

export default RolPage;