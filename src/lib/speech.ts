type Recognizer = {
  lang: string;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
};
type RecognizerCtor = new () => Recognizer;

// Says the text out loud using the browser's built-in voice.
export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fil-PH";
  utterance.rate = 0.85; // a little slower so learners can follow
  const voice = window.speechSynthesis.getVoices().find((v) => /^(fil|tl)/i.test(v.lang));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

// Listens once and returns what was heard. Returns false if the browser can't do it.
export function listen(onResult: (heard: string) => void, onEnd: () => void): boolean {
  const w = window as unknown as {
    SpeechRecognition?: RecognizerCtor;
    webkitSpeechRecognition?: RecognizerCtor;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return false;
  const rec = new Ctor();
  rec.lang = "fil-PH";
  rec.interimResults = false;
  rec.onresult = (e) => onResult(e.results[0][0].transcript);
  rec.onend = onEnd;
  rec.onerror = onEnd;
  rec.start();
  return true;
}