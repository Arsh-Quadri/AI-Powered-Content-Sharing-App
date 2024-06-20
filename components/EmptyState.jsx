import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";

const EmptyState = ({ title, subtitle, btntitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={{uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718797834/empty_vuqyni.png"}}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="font-psemibold text-xl text-center mt-2 text-white">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
      <CustomButton
        title={btntitle || "Create Video"}
        handlePress={() => router.push("/create")}
        containerStyles="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;
