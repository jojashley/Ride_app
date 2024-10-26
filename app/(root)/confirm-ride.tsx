import { FlatList, Text, View } from "react-native";
import RideLayout from "@/components/RideLayout";
import DriverCard from "@/components/DriverCard";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import {useDriverStore, useRideStore} from "@/store";
import React from "react";
import { useTranslation } from 'react-i18next';

const ConfirmRide = () => {
    const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  const { setSelectedRide } = useRideStore();
    const { t } = useTranslation();
    return (
        <RideLayout title={t('chooseADriver')} snapPoints={["65%", "85%"]}>
            <FlatList
                data={drivers}
                renderItem={({ item }) => (
                    <DriverCard
                        selected={selectedDriver!}
                        item={item}
                        setSelected={() => {
                          const id_driver = Number(item.driver_id)!;
                          setSelectedRide(id_driver);
                          setSelectedDriver(id_driver);
                          router.push("/(root)/book-ride");
                        }}
                    />
                )}
            />
        </RideLayout>
    );
};

export default ConfirmRide;