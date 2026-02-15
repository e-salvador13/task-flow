'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskInputProps {
  onSubmit: (input: string) => void;
}

export function TaskInput({ onSubmit }: TaskInputProps) {
  const [value, setValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setValue(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setValue('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-12"
    >
      <form onSubmit={handleSubmit}>
        <div
          className={`
            relative flex items-center gap-3
            bg-[var(--card)] rounded-2xl
            border-2 transition-all duration-300
            ${isFocused || isListening
              ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10'
              : 'border-[var(--card-border)]'
            }
          `}
        >
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="
              flex-1 px-6 py-5 bg-transparent
              text-lg placeholder:text-[var(--muted)]
              focus:outline-none
            "
          />

          {/* Voice button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`
              p-3 mr-2 rounded-xl transition-all duration-300
              ${isListening
                ? 'bg-red-500 text-white scale-110'
                : 'bg-[var(--card-border)] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white'
              }
            `}
          >
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div
                  key="listening"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  {/* Pulse animation */}
                  <span className="absolute inset-0 rounded-xl bg-red-500 animate-ping opacity-50" />
                </motion.div>
              ) : (
                <motion.svg
                  key="mic"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!value.trim()}
            className={`
              p-3 mr-3 rounded-xl transition-all duration-300
              ${value.trim()
                ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                : 'bg-[var(--card-border)] text-[var(--muted)] cursor-not-allowed'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </form>

      {/* Hint text */}
      <p className="mt-3 text-center text-sm text-[var(--muted)]">
        {isListening ? (
          <span className="text-red-500">🎤 Listening... tap to stop</span>
        ) : (
          <>Speak or type naturally — I'll organize it for you</>
        )}
      </p>
    </motion.div>
  );
}
