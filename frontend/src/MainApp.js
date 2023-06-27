import React from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";

import VoicePromptCard from "./components/VoicePromptCard";
import LoadingAlerts from "./components/LoadingAlerts";
import useMessageHandler from "./hooks/useMessageHandler";
import useAudioHandler from "./hooks/useAudioHandler";
import useRecordAudio from "./hooks/useRecordAudio";
import useButtonStates from "./hooks/useButtonStates";

function MainApp({ user }) {
  const { sendMessage, loading: messageLoading } = useMessageHandler(
    user.username,
    user.usertype
  );
  const {
    playResponse,
    stopOngoingAudio,
    loading: speakLoading,
  } = useAudioHandler();
  const {
    isPaused,
    isRecording,
    setIsRecording,
    setIsPaused,
    activeButton,
    setActiveButton,
  } = useButtonStates();

  const {
    pauseRecording,
    startRecording,
    stopRecording,
    isMicActive,
    mediaRecorder,
  } = useRecordAudio(sendMessage, playResponse, stopOngoingAudio, activeButton);

  const getAlert = () => {
    if (!isRecording) {
      return null;
    }
    if (messageLoading) {
      return {
        message: "AI is thinking",
        type: "info",
      };
    }

    if (speakLoading) {
      return {
        message: "AI is speaking",
        type: "info",
      };
    }

    if (isPaused) {
      return {
        message: "Paused",
        type: "warning",
      };
    }

    return null;
  };

  return (
    <div className="container app-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          margin: "auto",
          width: "100%",
          height: "calc(100vh - 64px)", // minus navbar height which is 64px
          maxWidth: "350px",
        }}
      >
        <div
          style={{
            borderRadius: "1rem",
            padding: "1rem",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <LoadingAlerts alert={getAlert()} />
          {mediaRecorder && (
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorder}
              width={350}
              height={55}
              barColor="#fff"
            />
          )}
          <VoicePromptCard
            startRecording={startRecording}
            pauseRecording={pauseRecording}
            stopRecording={stopRecording}
            stopOngoingAudio={stopOngoingAudio}
            isPaused={isPaused}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            setIsPaused={setIsPaused}
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
        </div>
      </div>
    </div>
  );
}

export default MainApp;
