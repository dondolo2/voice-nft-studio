/**
 * ElevenLabs Speech-to-Text & Text-to-Speech integration.
 * Key is read from VITE_ELEVENLABS_API_KEY in .env.local
 */

function getApiKey(): string {
  return (import.meta.env.VITE_ELEVENLABS_API_KEY as string) || "";
}

export function hasElevenLabsKey(): boolean {
  return getApiKey().trim().length > 0;
}

/**
 * Transcribe audio blob using ElevenLabs STT API.
 * Throws a clear error if API key is missing.
 */
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error(
      "ElevenLabs API key not set. Add VITE_ELEVENLABS_API_KEY to your .env.local file, then restart the dev server."
    );
  }

  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");
  formData.append("model_id", "scribe_v1");

  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    if (response.status === 401) {
      throw new Error("Invalid ElevenLabs API key. Check your VITE_ELEVENLABS_API_KEY.");
    }
    throw new Error(`ElevenLabs STT error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const text = (data.text || "").trim();

  if (!text) {
    throw new Error("No speech detected. Please speak clearly and try again.");
  }

  return text;
}

/**
 * TTS via ElevenLabs. Falls back to browser SpeechSynthesis if no key.
 */
export async function speakText(text: string): Promise<void> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return browserTTS(text);
  }

  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`TTS API returned ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    return new Promise<void>((resolve) => {
      audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
      audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
      audio.play().catch(() => resolve());
    });
  } catch (err) {
    console.warn("ElevenLabs TTS failed, using browser fallback:", err);
    return browserTTS(text);
  }
}

function browserTTS(text: string): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    speechSynthesis.speak(utterance);
  });
}
