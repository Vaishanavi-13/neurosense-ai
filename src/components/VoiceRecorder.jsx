import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, UploadCloud, Loader2 } from 'lucide-react';

export default function VoiceRecorder({ onRecordingComplete, isProcessing, initialAudioBlob }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  useEffect(() => {
    if (initialAudioBlob) {
      setAudioUrl(URL.createObjectURL(initialAudioBlob));
    } else {
      setAudioUrl(null);
    }
  }, [initialAudioBlob]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
    if (onRecordingComplete) {
      onRecordingComplete(null);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
      <div className="mb-6 flex flex-col items-center">
        {isRecording ? (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 bg-red-500 rounded-full animate-ping opacity-20"></div>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center z-10 border border-red-200">
              <Mic className="text-red-500 h-8 w-8 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <Mic className="text-primary-600 h-8 w-8" />
          </div>
        )}
        
        <div className="mt-4 text-2xl font-mono text-slate-700 font-semibold">
          {formatTime(recordingTime)}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors shadow-sm"
          >
            <Mic className="h-5 w-5 mr-2" /> Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors shadow-sm"
          >
            <Square className="h-5 w-5 mr-2" /> Stop Recording
          </button>
        )}

        {audioUrl && !isRecording && (
          <div className="flex flex-col w-full md:flex-row items-center gap-4">
            <audio src={audioUrl} controls className="h-12 w-full md:w-64 outline-none" />
            <button
              onClick={resetRecording}
              disabled={isProcessing}
              className="flex items-center justify-center px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Retry
            </button>
          </div>
        )}
      </div>
      
      {isProcessing && (
        <div className="mt-6 flex items-center text-primary-600 font-medium">
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Analyzing Speech Patterns...
        </div>
      )}
    </div>
  );
}
