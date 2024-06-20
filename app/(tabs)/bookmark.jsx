import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";
import useAppwrite from "../../lib/useAppwrite";
import { getBookmarkedPosts, toggleBookmark } from "../../lib/appwrite";
import VideoCard from "../../components/VideoCard";

const Bookmark = () => {
  const { data: savedPosts, refetch } = useAppwrite(() => getBookmarkedPosts());
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // console.log(savedPosts);
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            {/* <Text className="font-pmedium text-sm text-gray-100">
              Saved Posts
            </Text> */}
            <Text className="font-psemibold text-2xl text-white">
              Saved Posts
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Saved Posts Yet"
            subtitle="No saved videos found visit home page"
            btntitle=""
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Bookmark;
