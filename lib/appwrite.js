import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.arsh.arcane",
  projectId: "663340ea00263aca36ec",
  databaseId: "663354ee0011b5e1d565",
  userCollectionId: "663355290037596fb2b6",
  videoCollectionId: "663355a8003d165197c7",
  storageId: "66335a0a000021dcd60e",
};
// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);
    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );
    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [
        // Query.search("video", "https://cloud.appwrite.io"), // Filter to include only documents where the 'video' field is not null
        // Query.search("title", "Salute to this new AI model"),
        Query.orderDesc("$createdAt"), // Sort by creation date in descending order
        // Query.limit(7), // Limit the result to the latest 7 documents
      ]
    );
    // console.log(posts.documents);
    const filteredPosts = posts.documents.filter(
      (post) => post.video && post.video.startsWith("https://cloud.appwrite.io")
    );
    return filteredPosts;
  } catch (error) {
    console.log(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};
export const getUsersPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );
    return posts.documents;
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }
    if (!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };
  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );
    // console.log(uploadedFile);
    const fileUrl = await getFilePreview(uploadedFile?.$id, type);
    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const createVideo = async (form) => {
  try {
    // console.log(form.video, form.thumbnail, "form.video + form.thumbnail");

    let thumbnailUrl = null;
    let videoUrl = null;

    if (form.video !== null || form.thumbnail !== null) {
      [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"), //form.video &&
      ]);
    }

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        desc: form.desc,
        imagePrompt: form.imagePrompt,
        descPrompt: form.descPrompt,
        generatedImage: form.generatedImageUrl || null,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.log(error, "from create video");
    throw new Error(error.message);
  }
};

export const toggleBookmark = async (postId, currentBookmarkStatus) => {
  try {
    // Toggle the bookmark status
    // console.log("Document ID:", postId);
    const updatedPost = await databases.updateDocument(
      config.databaseId,
      config.videoCollectionId,
      postId,
      {
        bookmarked: !currentBookmarkStatus,
      }
    );
    return updatedPost;
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
};

export const getBookmarkedPosts = async () => {
  try {
    const bookmarkedPosts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("bookmarked", true), Query.orderDesc("$createdAt")]
    );
    return bookmarkedPosts.documents;
  } catch (error) {
    console.error("Error getting bookmarked posts:", error);
    throw error;
  }
};
