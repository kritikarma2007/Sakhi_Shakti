import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom Hook: useSpeech
 * Provides Text-to-Speech (TTS) using Web Speech API (window.speechSynthesis)
 * Supports browser compatibility checks, Hindi/English language selection,
 * speaking state tracking, and playback cancellation.
 */
export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [speechError, setSpeechError] = useState(null);
  const utteranceRef = useRef(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  // ─── Load Available System Voices ──────────────────────────────
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      try {
        const availableVoices = window.speechSynthesis.getVoices() || [];
        setVoices(availableVoices);
      } catch (err) {
        console.warn('Failed to load speech synthesis voices', err);
      }
    };

    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      try {
        window.speechSynthesis.cancel();
      } catch {}
    };
  }, [isSupported]);

  // ─── Stop / Cancel Speech ──────────────────────────────────────
  const stop = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Error cancelling speech synthesis', err);
    }
    setIsSpeaking(false);
    setSpeechError(null);
  }, [isSupported]);

  // ─── Speak Function ────────────────────────────────────────────
  const speak = useCallback((text, lang = 'hi-IN') => {
    if (!isSupported) {
      console.warn('[useSpeech] SpeechSynthesis API is not supported in this browser.');
      return false;
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
      return false;
    }

    // Cancel any active speech before starting new utterance
    stop();

    // The written script takes precedence so Hindi text is never sent to an English voice.
    const hasHindiScript = /[\u0900-\u097F]/.test(text);
    const lowerLang = String(lang).toLowerCase();
    const targetLang = hasHindiScript || ['hi', 'hi-in', 'hindi'].includes(lowerLang)
      ? 'hi-IN'
      : 'en-IN';

    try {
      // Select best matching voice from available voices
      const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      const langPrefix = targetLang.split('-')[0].toLowerCase();
      const matchedVoice = currentVoices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase())
        || currentVoices.find(v => v.lang.toLowerCase().startsWith(`${langPrefix}-`))
        || currentVoices.find(v => v.lang.toLowerCase() === langPrefix);

      if (targetLang === 'hi-IN' && !matchedVoice) {
        setSpeechError('missing-hindi-voice');
        setIsSpeaking(false);
        return false;
      }

      setSpeechError(null);
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = targetLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        // Interrupted errors happen naturally on user cancellation
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.warn('[useSpeech] Utterance error:', event.error);
        }
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.warn('[useSpeech] Failed to speak text', err);
      setIsSpeaking(false);
      setSpeechError('speech-failed');
      return false;
    }
  }, [isSupported, voices, stop]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    speechError
  };
};

export default useSpeech;
