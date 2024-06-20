import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  titleStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  return (
    <View className={`space-y-2 max-h-72 ${otherStyles}`}>
      <Text className={`text-base font-pmedium text-gray-100 ${titleStyles}`}>
        {title}
      </Text>
      <View
        className={`w-full ${
          {}
          // placeholder == "Add description about your post" ? "h-28" : "h-16"
        } px-4 bg-black-100 max-h-64 border py-7 border-black-200 rounded-2xl overflow-scroll focus:border-secondary items-center flex-row`}
        style={{ height: inputHeight }}
      >
        <TextInput
          className="flex-1 flex text-white font-psemibold text-base h-[200px]"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          multiline={placeholder == "Add description about your post"}
          onContentSizeChange={(e) =>
            setInputHeight(Math.max(40, e.nativeEvent.contentSize.height))
          }
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={
                !showPassword
                  ? {
                      uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718798356/eye_a347hp.png",
                    }
                  : {
                      uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718798337/eye-hide_mxzbd0.png",
                    }
              }
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
