import {
  View,
  Text,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { toggleBookmark } from "../lib/appwrite";

const VideoCard = ({
  video: {
    $id,
    title,
    thumbnail,
    video,
    desc,
    generatedImage,
    creator: { username, avatar },
    bookmarked,
  },
}) => {
  const [play, setPlay] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const truncateContent = (content) => {
    const maxLength = 120; // Set the maximum length of characters
    if (content.length <= maxLength) {
      return content;
    } else {
      const truncatedContent = content.substring(0, maxLength) + "...";
      return truncatedContent;
    }
  };

  const toggleExpand = (postId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate layout changes
    setExpandedPosts((prevExpandedPosts) => {
      const newExpandedPosts = new Set(prevExpandedPosts); // Create a copy of the current set
      if (newExpandedPosts.has(postId)) {
        newExpandedPosts.delete(postId); // Remove the post if it's already expanded
      } else {
        newExpandedPosts.add(postId); // Add the post if it's not expanded
      }
      return newExpandedPosts;
    });
  };

  const handleBookmarkToggle = async () => {
    try {
      setIsBookmarked((prevState) => !prevState);
      await toggleBookmark($id, isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  useEffect(() => {
    setIsBookmarked(bookmarked);
  }, [bookmarked]);

  return (
    <View className="flex-col w-full h-fit px-4 mb-10">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center ml-3 flex-1 gap-y-1">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular">
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <TouchableOpacity onPress={handleBookmarkToggle}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718798352/bookmark_eunlp9.png",
              }} //icons.bookmark
              tintColor={`${isBookmarked ? "#FFA001" : "#CDCDE0"}`}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      {video ? (
        <>
          {play ? (
            <Video
              source={{ uri: video }}
              className="w-full h-60 rounded-xl mt-3"
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls
              shouldPlay
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  setPlay(false);
                }
              }}
            />
          ) : (
            <View className="w-full h-60 rounded-xl mt-3 relative justify-center items-center">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setPlay(true)}
                className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
              >
                <Image
                  source={{ uri: thumbnail }}
                  className="w-full h-full rounded-xl mt-3"
                  resizeMode="cover"
                />
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718798344/play_kbff2g.png",
                  }} //icons.play
                  className="w-12 h-12 absolute"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail || generatedImage }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
      <Text className="text-sm h-fit text-gray-100 pt-5 whitespace-pre-wrap ">
        {expandedPosts.has($id) ? desc : desc && truncateContent(desc)}{" "}
        {desc && desc.length > 200 && (
          <View className="relative">
            <TouchableOpacity
              className="text-blue-500 absolute -top-[15px]"
              onPress={() => toggleExpand($id)}
            >
              <Text className="text-blue-500">
                {expandedPosts.has($id) ? "see less" : "see more"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Text>
    </View>
  );
};

export default VideoCard;
