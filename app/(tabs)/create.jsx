import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { Video, ResizeMode } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFetch, useFetchImage } from "../../lib/fetchData";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [addThumbnail, setAddThumbnail] = useState(false);
  const [loadDesc, setLoadDesc] = useState(false);
  const [loadImg, setLoadImg] = useState(false);
  const [loadingText, setLoadingText] = useState("Generating");
  const [ai, setAi] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    imagePrompt: "",
    descPrompt: "",
    desc: "",
    generatedImageUrl: null,
  });

  const [fetchQuery, setFetchQuery] = useState("");
  const [fetchImg, setFetchImg] = useState("");
  const { data } = useFetch(fetchQuery); // loading, error
  const { img } = useFetchImage(fetchImg); //, loadImg, err
  // !loading && setLoadDesc(false);
  // console.log(data);
  useEffect(() => {
    if (data) {
      // console.log(data, "****:from create page");
      setForm((prevForm) => ({ ...prevForm, desc: data }));
      setLoadDesc(false);
    }
  }, [data]);
  useEffect(() => {
    if (img) {
      // console.log(img, "****:from create page");
      setForm((prevForm) => ({ ...prevForm, generatedImageUrl: img }));
      setLoadImg(false);
    }
  }, [img]);

  useEffect(() => {
    if (loadDesc || loadImg) {
      const interval = setInterval(() => {
        setLoadingText((prev) => {
          if (prev === "Generating...") {
            return "Generating";
          } else {
            return prev + ".";
          }
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [loadDesc, loadImg]);

  const generateDesc = () => {
    if (form.descPrompt) {
      setLoadDesc(true);
      // console.log("got the prompt, to the fetchquery");
      setFetchQuery(form.descPrompt);
    } else {
      Alert.alert("Please add the prompt field");
    }
  };
  const generateImg = () => {
    if (form.imagePrompt) {
      setLoadImg(true);
      // console.log("got the prompt, to the fetchImgquery");
      setFetchImg(form.imagePrompt);
    } else {
      Alert.alert("Please add the prompt field");
    }
  };

  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const isImage = result.assets[0].type.startsWith("image");
    if (isImage) {
      setForm({ ...form, thumbnail: result.assets[0] });
    } else {
      setForm({ ...form, video: result.assets[0] });
      setAddThumbnail(true);
    }
  };

  const submit = async () => {
    if (!form.desc || !form.title) {
      //!form.video || !form.thumbnail ||
      return Alert.alert("Please fill in all the fields");
    }
    setUploading(true);
    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });
      Alert.alert("Success", "Post Uploaded Successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        // prompt: "",
        imagePrompt: "",
        descPrompt: "",
        desc: "",
        generatedImageUrl: null,
      });
      setUploading(false);
      setAddThumbnail(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Posts</Text>
        <TouchableOpacity
          onPress={() => setAi(!ai)}
          className={`w-[145px] mt-4 p-2 rounded-xl text-gray-100 ${
            ai ? "bg-secondary" : "bg-black-100 border border-gray-500"
          }`}
        >
          <Text
            className={`font-psemibold text-sm text-center ${
              ai ? "text-black" : "text-[#7b7b8b]"
            }`}
          >
            Generate with Ai
          </Text>
        </TouchableOpacity>
        <FormField
          title="Post Title"
          value={form.title}
          placeholder="Give your post a catchy title"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-4"
        />

        {ai && (
          <>
            <FormField
              title="Generate Image With AI"
              value={form.imagePrompt}
              placeholder="Add prompt to generate image"
              handleChangeText={(e) => setForm({ ...form, imagePrompt: e })}
              otherStyles="mt-7"
              titleStyles="text-secondary"
            />
            <TouchableOpacity
              onPress={() => {
                // setAi(!ai);
                generateImg();
              }}
              className={`w-[120px] mt-4 p-2 rounded-xl text-gray-100 ${
                ai ? "bg-secondary" : "bg-black-100 border border-gray-500"
              }`}
            >
              <Text
                className={`font-psemibold text-sm text-center ${
                  ai ? "text-black" : "text-[#7b7b8b]"
                }`}
              >
                {loadImg ? loadingText : "Generate"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-psemibold">
            {ai ? "Upload Or Generate" : "Upload Document"}
          </Text>
          <TouchableOpacity onPress={() => handleUpload()}>
            {form.video || form.thumbnail ? (
              form.video ? (
                <Video
                  source={{ uri: form.video.uri }}
                  className="w-full h-64 rounded-2xl"
                  resizeMode={ResizeMode.COVER}
                />
              ) : (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode="contain"
                  className="w-full h-64 rounded-2xl"
                />
              )
            ) : form.generatedImageUrl ? (
              <View className="mt-7">
                <Text className="text-base text-gray-100 font-psemibold">
                  Generated Image
                </Text>
                <Image
                  source={{ uri: form.generatedImageUrl }}
                  resizeMode="contain"
                  className="w-full h-64 rounded-2xl mt-2"
                />
              </View>
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={{
                      uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718798350/upload_p0rdnj.png",
                    }} //icons.upload
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {addThumbnail && (
          <View className="mt-7 space-y-2">
            <Text className="text-base text-gray-100 font-psemibold">
              Add Thumbnail To Your Video
            </Text>
            <TouchableOpacity onPress={() => handleUpload()}>
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-14 px-4 bg-black-100 rounded-2xl justify-center items-center border border-black-200 flex-row space-x-2">
                  <Image
                    source={{
                      uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718798350/upload_p0rdnj.png",
                    }} //icons.upload
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
        {ai && (
          <>
            <FormField
              title="Generate Ai Description"
              value={form.descPrompt}
              placeholder="Add prompt to generate Desc."
              handleChangeText={(e) => setForm({ ...form, descPrompt: e })}
              otherStyles="mt-7"
              titleStyles="text-secondary"
            />
            <TouchableOpacity
              onPress={generateDesc}
              className={`w-[120px] mt-4 p-2 rounded-xl text-gray-100 ${
                ai ? "bg-secondary" : "bg-black-100 border border-gray-500"
              }`}
            >
              <Text
                className={`font-psemibold text-sm text-center ${
                  ai ? "text-black" : "text-[#7b7b8b]"
                }`}
              >
                {loadDesc ? loadingText : "Generate"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <FormField
          title={ai ? "Generate or Add Description" : "Add Description"}
          value={form.desc}
          placeholder="Add description about your post"
          handleChangeText={(e) => setForm({ ...form, desc: e })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
        {/* {loading && <Text className="text-gray-100 mt-4">Loading...</Text>} */}
        {/* {error && <Text className="text-red-500 mt-4">{error.message}</Text>} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
