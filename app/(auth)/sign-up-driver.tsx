import React, { useState } from "react";
import { Text, ScrollView, View, Image, Alert } from "react-native";
import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useSignUp} from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";
import ButtomGroup from "@/components/ButtomGrup";

const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    let typeVehicle = "car";
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        last_name: "",
        profile_image_url: "@/assets/icons/person.png",
        car_image_url: "@/assets/images/defaultCar.png",
        car_seats: "",
    });
    const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: "",
    });
    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                emailAddress: form.email,
                password: form.password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            setVerification({ ...verification, state: "pending" });
        } catch (err: any) {
            Alert.alert("Error", err.error[0].longMessage);
        }
    };

    const onPressVerify = async () => {
        if (!isLoaded) return;

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            });

            if (completeSignUp.status === "complete") {
                await fetchAPI("/(api)/driver", {
                    method: "POST",
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        clerkId: completeSignUp.createdUserId,
                        last_name: form.last_name,
                        profile_image_url: form.profile_image_url,
                        car_image_url: form.car_image_url,
                        car_seats: form.car_seats,
                        rol: "driver",
                        rating: " 0.0",
                    }),
                });

                await setActive({ session: completeSignUp.createdSessionId });
                setVerification({ ...verification, state: "success" });
            } else {
                setVerification({
                    ...verification,
                    error: "Verification failed",
                    state: "failed",
                });
            }
        } catch (err: any) {
            setVerification({
                ...verification,
                error: err.error[0].longMessage,
                state: "failed",
            });
        }
    };
    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                        Create Your Account
                    </Text>
                </View>
                <View className="p-5">
                    <InputField
                        label="Name"
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={form.name}
                        onChangeText={(value) => setForm({ ...form, name: value })}
                    />
                    <InputField
                        label="Last Name"
                        placeholder="Enter your name"
                        icon={icons.person}
                        value={form.last_name}
                        onChangeText={(value) => setForm({ ...form, last_name: value })}
                    />
                    <ButtomGroup
                        titles={["car", "motorcycle", "bus"]}
                        containerStyles="mt-5"
                        titleButtons="Type of vehicle"
                        valueButtom={typeVehicle}
                    />
                    <InputField
                        label="Vehicle seats"
                        icon={icons.point}
                        placeholder="12345"
                        value={form.car_seats}
                        keyboardType="numeric"
                        onChangeText={(value) => setForm({ ...form, car_seats: value })}
                    />
                    <InputField
                        label="Email"
                        placeholder="Enter your email"
                        icon={icons.email}
                        value={form.email}
                        onChangeText={(value) => setForm({ ...form, email: value })}
                    />
                    <InputField
                        label="Password"
                        placeholder="Enter your password:"
                        icon={icons.lock}
                        value={form.password}
                        secureTextEntry={true}
                        onChangeText={(value) => setForm({ ...form, password: value })}
                    />
                    <CustomButton
                        title="Sign Up"
                        onPress={onSignUpPress}
                        className="mt-6"
                    />
                    <Link
                        href="/sign-in"
                        className="text-lg text-center text-general-200 mt-10"
                    >
                        <Text>Already have an account?</Text>
                        <Text className="text-primary-500">Log In</Text>
                    </Link>
                </View>
                <ReactNativeModal isVisible={showSuccessModal}>
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                        <Image
                            source={images.check}
                            className="w-[110px] h-[110px] mx-auto my-5"
                        />
                        <Text className="text-3xl font-JakartaSemiBold text-center">
                            Verified
                        </Text>
                        <Text className="text-base text-gray-400 text-center">
                            You have successfully verified your account
                        </Text>
                        <CustomButton
                            title="Browse Home"
                            onPress={() => {
                                setShowSuccessModal(false);
                                router.replace("/(root-driver)/(tabs)/home");
                            }}
                            className="mt-5"
                        />
                    </View>
                </ReactNativeModal>
                <ReactNativeModal
                    isVisible={verification.state === "pending"}
                    onModalHide={() => {
                        if (verification.state === "success") setShowSuccessModal(true);
                    }}
                >
                    <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                        <Text className="text-3xl font-JakartaSemiBold text-center">
                            Verification
                        </Text>
                        <Text className="font-Jakarta mb-5">
                            We've sent verification code to {form.email}
                        </Text>
                        <InputField
                            label="Code"
                            icon={icons.lock}
                            placeholder="12345"
                            value={verification.code}
                            keyboardType="numeric"
                            onChangeText={(code) =>
                                setVerification({ ...verification, code })
                            }
                        />
                        {verification.error && (
                            <Text className="text-red-500 text-sm mt-1">
                                {verification.error}
                            </Text>
                        )}
                        <CustomButton
                            className="mt-5 bg-success-500"
                            onPress={onPressVerify}
                            title="Verify Email"
                        />
                    </View>
                </ReactNativeModal>
            </View>
        </ScrollView>
    );
};

export default SignUp;
