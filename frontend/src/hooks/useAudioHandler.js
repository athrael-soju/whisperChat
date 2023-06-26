import { useRef } from "react";
import env from "react-dotenv";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import fetch from "../libs/fetch";

const useAudioHandler = () => {
  const audioRef = useRef(null);
  const url = `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_SPEAK_ENDPOINT}`;
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  console.log({
    data: mutation.data,
    loading: mutation.loading,
  });

  const playResponse = async (text) => {
    try {
      await mutation.mutateAsync(JSON.stringify({ text }));

      // const response = await mutate(
      //   fetch(url, {
      //     // method: "POST",

      //     // body: ,
      //   })
      // );

      const blob = await mutation.data.data.blob();
      const audioUrl = URL.createObjectURL(blob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
    } catch (error) {
      console.error("Error fetching audio response:", error);
    }
  };

  const stopOngoingAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { playResponse, stopOngoingAudio };
};

export default useAudioHandler;
