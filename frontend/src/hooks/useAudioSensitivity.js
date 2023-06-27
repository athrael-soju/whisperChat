import { useState, useEffect } from "react";
import env from "react-dotenv";

const useAudioSensitivity = () => {
  const [isMicActive, setIsMicActive] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState();

  useEffect(() => {
    let audioContext, analyser, audioStreamSource;
    const checkAudioLevel = async () => {
      let stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.start();

      recorder.addEventListener("dataavailable", (event) => {
        recorder?.stream?.getTracks().forEach((t) => t.stop());
        setMediaRecorder(undefined);
      });

      audioContext = new AudioContext();
      audioStreamSource = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();

      analyser.minDecibels = parseInt(env.AUDIO_DB_SENSITIVITY);
      audioStreamSource.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const domainData = new Uint8Array(bufferLength);

      const detectSound = () => {
        let soundDetected = false;

        analyser.getByteFrequencyData(domainData);

        for (let i = 0; i < bufferLength; i++) {
          if (domainData[i] > 0) {
            soundDetected = true;
          }
        }

        setIsMicActive(soundDetected);
        requestAnimationFrame(detectSound);
      };
      detectSound();
    };
    checkAudioLevel();

    return () => {
      if (audioStreamSource) {
        audioStreamSource.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);
  return { isMicActive, mediaRecorder };
};

export default useAudioSensitivity;
