import axios from "axios";
import { useState, useEffect } from "react";
import { uploadImageToCloudinary } from "./uploadImageToCloudinary";
import { RAPIC_API_FIRST, RAPID_API_SEC } from "@env";

export const useFetch = (query) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      // primary api

      // const options = {
      //   method: "POST",
      //   url: "https://chatgpt-42.p.rapidapi.com/gpt4",
      //   headers: {
      //     "content-type": "application/json",
      //     "X-RapidAPI-Key":
      //       RAPIC_API_FIRST,
      //     "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com",
      //   },
      //   data: {
      //     messages: [
      //       {
      //         role: "user",
      //         content: query,
      //       },
      //     ],
      //     web_access: false,
      //   },
      // };

      // secondary api
      const options = {
        method: "POST",
        url: "https://chatgpt-42.p.rapidapi.com/gpt4",
        headers: {
          "x-rapidapi-key": RAPID_API_SEC,
          "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        data: {
          messages: [
            {
              role: "user",
              content: query,
            },
          ],
          web_access: false,
        },
      };

      try {
        const response = await axios.request(options);
        // console.log(response.data.result, "*** from fetch Data");
        // setData("response is here");
        setData(response.data.result);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return { data, loading, error };
};

export const useFetchImage = (query) => {
  const [img, setImg] = useState(null);
  const [loadImg, setLoadImg] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchImgData = async () => {
      // console.log("fetchImage data function here");
      // primary api image
      // const options = {
      //   method: "POST",
      //   url: "https://chatgpt-42.p.rapidapi.com/texttoimage",
      //   headers: {
      //     "content-type": "application/json",
      //     "X-RapidAPI-Key":
      //       RAPIC_API_FIRST,
      //     "X-RapidAPI-Host": "chatgpt-42.p.rapidapi.com",
      //   },
      //   data: {
      //     text: query,
      //   },
      // };

      // secondary api image
      const options = {
        method: "POST",
        url: "https://chatgpt-42.p.rapidapi.com/texttoimage",
        headers: {
          "x-rapidapi-key": RAPID_API_SEC,
          "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        data: { text: query },
      };

      try {
        const response = await axios.request(options);
        // console.log();
        // console.log(response.data.generated_image, "form Image fetch code");
        // setImg(response.data.generated_image);
        const uploadedUrl = await uploadImageToCloudinary(
          response.data.generated_image
        );
        setImg(uploadedUrl);
        // console.log(uploadedUrl);
        // setImg(
        //   "https://res.cloudinary.com/dhpe0g5zg/image/upload/v1717092223/khj7suvf0utmydrmf8pq.jpg"
        // );
      } catch (error) {
        console.error(error);
        setErr(error);
      } finally {
        setLoadImg(false);
      }
    };

    fetchImgData();
  }, [query]);

  return { img, loadImg, err };
};
