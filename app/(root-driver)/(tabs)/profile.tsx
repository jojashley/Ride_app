import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Image, ScrollView, Text, View, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import i18next from "@/services/i18next";
import { useTranslation } from "react-i18next";
import InputField from "@/components/InputField";

const Profile = () => {
    const { t } = useTranslation();
    const { user } = useUser();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const changeLanguage = (lng) => {
        i18next.changeLanguage(lng);
    };

    useEffect(() => {
        const fetchDriverData = async () => {
            if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
                console.warn("User data is not available.");
                return;
            }

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
                console.log("API Response:", data); // Imprime la respuesta de la API

                // Asegúrate de que la estructura sea correcta
                if (data.data && data.data.length > 0) {
                    setFirstName(data.data[0]?.user_name);
                    setLastName(data.data[0]?.driver_last_name);
                    console.log("First Name:", data.data[0]?.user_name);
                    console.log("Last Name:", data.data[0]?.driver_last_name);
                } else {
                    console.warn("No data found");
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchDriverData();
    }, [user]);

    return (
        <SafeAreaView className="flex-1">
            <ScrollView
                className="px-5"
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <Text className="text-2xl font-JakartaBold my-5">{t('profile')}</Text>

                <View className="flex items-center justify-center my-5">
                    <Image
                        source={{
                            uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                        }}
                        style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
                        className="rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
                    />
                </View>

                <View className="flex flex-col items-start justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 px-5 py-3">
                    <View className="flex flex-col items-start justify-start w-full">
                        <InputField
                            label={t('firstName')}
                            placeholder={firstName || user?.emailAddresses[0].emailAddress.split("@")[0] || t('notFound')}
                            containerStyle="w-full"
                            inputStyle="p-3.5"
                            editable={false}
                        />

                        <InputField
                            label={t('lastName')}
                            placeholder={lastName || t('notFound')}
                            containerStyle="w-full"
                            inputStyle="p-3.5"
                            editable={false}
                        />

                        <InputField
                            label={t('email')}
                            placeholder={user?.primaryEmailAddress?.emailAddress || t('notFound')}
                            containerStyle="w-full"
                            inputStyle="p-3.5"
                            editable={false}
                        />

                        <Text className="text-xl font-bold text-black text-center my-3">{t('language')}</Text>
                        <View className="flex flex-row justify-around my-3">
                            <Button title={t('english')} onPress={() => changeLanguage('en')} />
                            <Button title={t('spanish')} onPress={() => changeLanguage('es')} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
