import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import {
  getAllPosts,
  getBookmarkedPosts,
  getLatestPosts,
  toggleBookmark,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
const home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts, refetch: refetchLatestPosts } =
    useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);
  // const [bookmarked, setBookmarked] = useState([]);
  // console.log(latestPosts);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchLatestPosts()]);
    // console.log("refresh from Home page ***");
    setRefreshing(false);
    // posts.forEach((post) =>
    //   console.log("Home page", post.title, post.bookmarked)
    // );
  };

  const { user } = useGlobalContext();
  // console.log(postsData, "*****");
  // console.log(logosmall);
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts} //
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6 h-[600px]">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back,
                </Text>
                <Text className="font-psemibold text-2xl text-white">
                  {user?.username}
                </Text>
              </View>
              <View>
                <Image
                  source={{
                    uri: "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1718797777/logo-small_xvsbqd.png",
                  }} //images.logoSmall
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput placeholder="Search for a video topic" />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 font-pregular text-lg mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to create a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default home;

// import React from "react";
// import { Image, View, Text } from "react-native";
// // import logosmall from "../../assets/firebase.png";
// const logosmall = require("../../assets/firebase.png");

// const Home = () => {
//   console.log(logosmall);
//   return (
//     <View>
//       <Image
//         source={logosmall}
//         className="border border-black-100 bg-black-100 m-5"
//         style={{ width: 150, height: 150 }}
//       />
//       <Text>Hello</Text>
//     </View>
//   );
// };

// export default Home;
