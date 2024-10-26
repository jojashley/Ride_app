import React, { useState } from "react";
import { Text, View } from "react-native";
import { ButtonGroup } from "@rneui/themed";
import { ButtomGroupProps } from "@/types/type";

const ButtomGroup = ({
                         titles,
                         containerStyles,
                         titleButtons,
                         valueButtom,
                         ...props
                     }: ButtomGroupProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    return (
        <View className={`${containerStyles}`}>
            <Text className={`text-lg font-bold`}>{titleButtons}</Text>
            <ButtonGroup
                buttons={titles}
                selectedIndex={selectedIndex}
                onPress={(value) => {
                    setSelectedIndex(value);
                    valueButtom = titles[selectedIndex];
                }}
                containerStyle={{ marginBottom: 20 }}
            />
        </View>
    );
};
export default ButtomGroup;
