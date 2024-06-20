import React from "react";
// import { StatusBar } from "expo-status-bar";
import {
  AppRegistry,
  Image,
  ScrollView,
  Text,
  View,
  StatusBar,
} from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvider";

function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100.1%" }}>
        <View className="w-full h-full justify-center items-center px-4">
          <Image
            source={{
              uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718797834/logo_ysu1ap.png",
            }} //images.logo
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={{
              uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718797837/cards_r5wrin.png",
            }}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>{" "}
            </Text>
            <Image
              source={{
                uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718798172/path_bfouyj.png",
              }} //images.path
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: embark on a journey of limitless
            exploration with Aora
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      {/* <StatusBar backgroundColor="#161622" style="light" /> */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
    </SafeAreaView>
  );
}

AppRegistry.registerComponent("main", () => App);
export default App;

// Register the main component for web
if (typeof document !== "undefined") {
  const rootTag =
    document.getElementById("root") || document.getElementById("main");
  AppRegistry.runApplication("main", { initialProps: {}, rootTag });
}
