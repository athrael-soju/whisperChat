import { useRef, useState } from "react";
import env from "react-dotenv";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useAudioHandler = () => {
  const audioRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const url = `${env.SERVER_ADDRESS}:${env.SERVER_PORT}${env.SERVER_SPEAK_ENDPOINT}`;
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(url, data, {
        headers: { "Content-Type": "application/json" },
        responseType: "blob",
      });
    },
  });

  const playResponse = async (text) => {
    try {
      setLoading(true);
      await mutation.mutateAsync(
        { text },
        {
          onSuccess: async (res) => {
            const blob = res?.data;
            const audioUrl = URL.createObjectURL(blob);
            audioRef.current = new Audio(audioUrl);
            audioRef.current.play();
            audioRef.current.onended = () => {
              setLoading(false);
            };
          },
        }
      );
    } catch (error) {
      setLoading(false);
      console.error("Error fetching audio response:", error);
    }
  };

  const stopOngoingAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { playResponse, stopOngoingAudio, loading, blob: mutation.data?.data };
};

export default useAudioHandler;
