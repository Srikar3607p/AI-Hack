import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Check, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const VoiceRecorder = ({ onTranscriptionComplete, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Default to Indian English / standard

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript + ' ';
      }
      setTranscript(currentTranscript.trim());
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please type your complaint description directly.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Recognition start error:', err);
      }
    }
  };

  const handleApply = () => {
    if (transcript) {
      onTranscriptionComplete(transcript);
    }
  };

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-civic-50/50 dark:from-slate-900/60 dark:to-civic-950/40 border border-slate-200 dark:border-slate-800 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl text-white transition-all ${isRecording ? 'bg-rose-600 animate-pulse' : 'bg-civic-600'}`}>
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Voice Complaint Intake
            </h5>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {isRecording ? 'Listening... speak clearly about the civic issue' : 'Click to dictate your complaint in English/Regional terms'}
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant={isRecording ? 'danger' : 'primary'}
          onClick={toggleRecording}
          icon={isRecording ? MicOff : Mic}
        >
          {isRecording ? 'Stop Recording' : 'Record Voice'}
        </Button>
      </div>

      {/* Real-time transcription view */}
      {transcript && (
        <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-civic-600 dark:text-civic-400 block mb-1">
            Transcribed Text:
          </span>
          <p className="text-xs text-slate-800 dark:text-slate-200 italic">
            "{transcript}"
          </p>
          <div className="mt-2 flex justify-end">
            <Button size="sm" variant="success" icon={Check} onClick={handleApply}>
              Insert Into Complaint Description
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
