import axios from 'axios';
import React, { useState, useRef } from 'react';
import url from '../lib/url';
import Image from 'next/image';

const AudioRecorder = ({ setUserInput }: any) => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      setUserInput('Обработка аудио...');
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

      const formData = new FormData();

      formData.append('audio', audioBlob);

      try {
        await axios.post(`${url}/audio-prompt`, formData).then((response) => {
          const userVoiceInput = response.data.transcription;
          console.log(userVoiceInput);

          setUserInput(userVoiceInput);
        });
        // localStorage.setItem('userVoiceInput', response.data.transcription);
      } catch (err) {
        console.log('Cannot send audio prompt to server');
      }

      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <div className="border-black w-10">
      <button
        className=" border-blue-600 w-full h-full flex items-center justify-center"
        onClick={recording ? stopRecording : startRecording}
      >
        <span
          className={`border-red-600 w-full flex  items-center justify-center p-2.5 rounded-full ${
            recording ? 'bg-green-800 recording' : 'bg-main-color'
          }`}
        >
          <Image src="/mic.svg" alt="mic" width={20} height={20} />
        </span>
      </button>
    </div>
  );
};

export default AudioRecorder;
