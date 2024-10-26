import {useUser} from "@clerk/clerk-expo";
import {Image, Text, View} from "react-native";

import RideLayout from "@/components/RideLayout";
import {icons} from "@/constants";
import {formatTime} from "@/lib/utils";
import {useDriverStore, useLocationStore, useRideStore} from "@/store";
import Payment from "@/components/Payment";
import { useTranslation } from 'react-i18next';
import {useEffect} from "react";


const BookRide = () => {
    const {userAddress, destinationAddress} = useLocationStore();
    const {drivers, selectedDriver} = useDriverStore();
    const {selectedRide, rides} = useRideStore();
    const { t } = useTranslation();

    const driverDetails = drivers?.filter(
        (driver) => +driver.driver_id === selectedDriver,
    )[0];
    const rideDetails = rides?.filter(
      (ride) => selectedRide && ride.driver_id === selectedRide.driver_id,
    )[0];

    useEffect(() => {
        console.log(driverDetails);
    },[]);

    return (
        <RideLayout title={t('bookRide')} snapPoints={["75%", "90%"]}>
            <>
                <Text className="text-xl font-JakartaSemiBold mb-3">
                    {t('rideInformation')}
                </Text>

                <View className="flex flex-col w-full items-center justify-center mt-10">
                    <Image
                        source={{uri: driverDetails?.profile_image_url}}
                        className="w-28 h-28 rounded-full"
                    />

                    <View className="flex flex-row items-center justify-center mt-5 space-x-2">
                        <Text className="text-lg font-JakartaSemiBold">
                            Information Ride
                        </Text>

                        <View className="flex flex-row items-center space-x-0.5">
                            <Image
                                source={icons.star}
                                className="w-5 h-5"
                                resizeMode="contain"
                            />
                            <Text className="text-lg font-JakartaRegular">
                                {driverDetails?.rating}
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    className="flex flex-col w-full items-start justify-center py-3 px-5 rounded-3xl bg-general-600 mt-5">
                    <View className="flex flex-row items-center justify-between w-full border-b border-white py-3">
                        <Text className="text-lg font-JakartaRegular">{t('ridePrice')}</Text>
                        <Text className="text-lg font-JakartaRegular text-[#0CC25F]">
                            ₡{rideDetails?.fare_price}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center justify-between w-full py-3">
                        <Text className="text-lg font-JakartaRegular">{t('carSeats')}</Text>
                        <Text className="text-lg font-JakartaRegular">
                            {driverDetails?.car_seats}
                        </Text>
                    </View>
                </View>
                <Payment />
            </>
        </RideLayout>
    );
};

export default BookRide;