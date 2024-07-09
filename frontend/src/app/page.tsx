'use client';

import { useState, useEffect, useRef } from 'react';
import context from './context';
import axios from 'axios';
import Markdown from 'react-markdown';
import { TokenForm } from './components/TokenForm';

export default function Home() {
  const [trelloToken, setTrelloToken] = useState('');
  const [trelloAuth, setTrelloAuth] = useState('');
  const [showElement, setShowElement] = useState(true);
  const [error, setError] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'user',
      parts: [
        {
          text: context,
        },
      ],
    },
  ]);

  useEffect(() => {
    console.log(chatHistory);
  }, [chatHistory]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        audioChunksRef.current = [];

        // Send the audio file to the server for recognition
        const formData = new FormData();
        formData.append('audio', audioBlob);

        const response = await fetch('/api/post_audio', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        console.log(result);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    // console.log(audioURL);
    setIsRecording(false);
  };

  const getGeminiResponse = async () => {
    if (!value) {
      setError('Пожалуйста, введите ваш запрос.');
      return;
    }
    try {
      const savedTrelloToken = localStorage.getItem('TrelloToken');
      const savedTrelloAuth = localStorage.getItem('AuthToken');
      setIsLoading(true);

      const response = await axios.post('http://localhost:5000/gemini', {
        userPrompt: value,
        apiKey: savedTrelloToken ? savedTrelloToken : trelloToken,
        token: savedTrelloAuth ? savedTrelloAuth : trelloAuth,
        history: chatHistory,
      });

      console.log(response);

      const data = response.data;
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: 'user',
          parts: [{ text: value }],
        },
        {
          role: 'model',
          parts: [{ text: data }],
        },
      ]);
      setValue('');
      setIsLoading(false);
      setError('');
    } catch (e: any) {
      console.log(e);
      setError('Что-то пошло не так. Пожалуйста, попробуйте еще раз.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="app border-2 flex items-center justify-center h-screen flex-col">
        {showElement ? (
          <TokenForm
            setTrelloAuth={setTrelloAuth}
            setShowElement={setShowElement}
            setTrelloToken={setTrelloToken}
            setIsLoading={setIsLoading}
          />
        ) : (
          <div className="w-full h-screen p-5">
            <p className="mt-20">Что вы хотите создать в Trello сегодня?</p>
            <div className="input-container">
              <input
                className="border-4"
                value={value}
                placeholder="Создай мне карточку с названием 'Тестовая карточка...'"
                onChange={(e) => setValue(e.target.value)}
              ></input>
              <div className="flex flex-col">
                {<button onClick={getGeminiResponse}>Send</button>}
              </div>
            </div>
            <div>
              <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              {audioURL && (
                <div>
                  <audio controls src={audioURL}></audio>
                  <a href={audioURL} download="recording.wav">
                    Download Recording
                  </a>
                </div>
              )}
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <div className="search-result">
              {chatHistory.map(
                (e, id) =>
                  id !== 0 && (
                    <div key={id}>
                      {' '}
                      <p className="answer">
                        {e.role === 'user' ? (
                          <span className="text-red-500">{e.role}: </span>
                        ) : (
                          <span className="text-green-500">{e.role}: </span>
                        )}
                        {e.parts.map((item, id) => (
                          <Markdown key={id}>{item.text}</Markdown>
                        ))}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
      {/* <div className="trello-container">
        <iframe
          src="https://trello.com/b/Atc5OQru.html"
          width="300"
          frameBorder={0}
          height="300"
          className="border-2 border-blue-900"
        ></iframe>
      </div> */}
      {isLoading && <div className="loader">Loading...</div>}
    </>
  );
}
