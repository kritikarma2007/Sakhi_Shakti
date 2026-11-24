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
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
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

    // Normalize language tag
    let targetLang = lang;
    const lowerLang = String(lang).toLowerCase();

    // Auto-detect Hindi script if language isn't explicitly set to English
    const hasHindiScript = /[\u0900-\u097F]/.test(text);

    if (lowerLang === 'hi' || lowerLang === 'hi-in' || lowerLang === 'hindi' || (hasHindiScript && lowerLang !== 'en' && lowerLang !== 'en-in')) {
      targetLang = 'hi-IN';
    } else if (lowerLang === 'en' || lowerLang === 'en-in' || lowerLang === 'english') {
      targetLang = 'en-IN';
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = targetLang;
      utterance.rate = 0.95; // Slightly slower pace for optimal rural comprehension
      utterance.pitch = 1.0;

      // Select best matching voice from available voices
      const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      if (currentVoices && currentVoices.length > 0) {
        const langPrefix = targetLang.split('-')[0].toLowerCase();

        // 1. Exact match (e.g. hi-IN)
        let matchedVoice = currentVoices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase());

        // 2. Prefix match (e.g. hi)
        if (!matchedVoice) {
          matchedVoice = currentVoices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
        }

        // 3. Indian English fallback if English requested
        if (!matchedVoice && langPrefix === 'en') {
          matchedVoice = currentVoices.find(v => v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase() === 'en-us');
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

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
      return false;
    }
  }, [isSupported, voices, stop]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  };
};

export default useSpeech;
