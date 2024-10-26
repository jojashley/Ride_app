import { FlatList, Text, View } from "react-native";
import RideLayout from "@/components/RideLayout";
import DriverCard from "@/components/DriverCard";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { useDriverStore } from "@/store";
import React from "react";
import { useTranslation } from 'react-i18next';

const ConfirmRide = () => {
    const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
    const { t } = useTranslation();
    return (
        <RideLayout title={t('chooseADriver')} snapPoints={["65%", "85%"]}>
            <FlatList
                data={drivers}
                renderItem={({ item }) => (
                    <DriverCard
                        selected={selectedDriver!}
                        item={item}
                        setSelected={() => setSelectedDriver(Number(item.id)!)}
                    />
                )}
                ListFooterComponent={() => (
                    <View className="mx-5 mt-10">
                        <CustomButton
                            title={t('selectRide')}
                            onPress={() => router.push("/(root)/book-ride")}
                        />
                    </View>
                )}
            />
        </RideLayout>
    );
};

export default ConfirmRide;