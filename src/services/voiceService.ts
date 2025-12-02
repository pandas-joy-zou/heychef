import { SpeechRecognition } from '@capacitor-community/speech-recognition';

const is_native = () => {
  return !!(window as any).Capacitor?.isNativePlatform;
};

export class VoiceService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis = window.speechSynthesis;
  private is_listening = false;

  private on_command_callback: ((command: string) => void) | null = null;
  private on_speak_end_callback: (() => void) | null = null;
  private on_wake_word_callback: (() => void) | null = null;
  private on_listening_state_change: ((is_listening: boolean) => void) | null = null;


  constructor() {
    if (!is_native()) {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        this.recognition = new SpeechRecognitionAPI();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = "en-US";

        this.recognition.onresult = (event: any) => {
          const result = event.results[event.resultIndex];
          if (!result.isFinal) return;

          const transcript = result[0].transcript.toLowerCase().trim();
          if (this.on_command_callback) this.on_command_callback(transcript);
        };

        this.recognition.onend = () => {
          this.is_listening = false;
        };

        this.recognition.onerror = (e: any) =>
          console.error("error on not native:", e);
      }
    }
  }

  async start_listening(on_command: (command: string) => void): Promise<void> {
    this.on_command_callback = on_command;

    if (is_native()) {
      console.log("ios detected");

      try {
        const perm_status: any = await SpeechRecognition.checkPermissions();
        const speech_granted =
          perm_status?.speech === "granted" ||
          perm_status?.speechRecognition === "granted" ||
          perm_status?.microphone === "granted" ||
          perm_status?.granted === true;

        if (!speech_granted) await SpeechRecognition.requestPermissions();

        if (this.is_listening) {
          await this.stop_listening();
          await new Promise(r => setTimeout(r, 350));
        }

        await SpeechRecognition.start({
          language: "en-US",
          maxResults: 1,
          partialResults: true,
          popup: false,
        });

        this.is_listening = true;
        let partial_buffer = "";
        let last_partial_time = 0;
        let final_timeout: any = null;

        SpeechRecognition.addListener("partialResults", (data: any) => {
          const part = data.matches?.[0];
          if (!part) return;

          partial_buffer = part.toLowerCase().trim();
          last_partial_time = Date.now();
          console.log("partial_buffer:", partial_buffer);

          if (final_timeout) clearTimeout(final_timeout);

          final_timeout = setTimeout(() => {
            if (partial_buffer && this.on_command_callback) {
              console.log("final_command:", partial_buffer);
              this.on_command_callback(partial_buffer);
            }
            partial_buffer = "";
          }, 800);
        });

        SpeechRecognition.addListener("listeningState", (data: any) => {
          console.log("current_state:", data.status);
        });
      } catch (err) {
        console.error("native error:", err);
      }

      return;
    }

    if (!this.recognition) return;

    if (this.is_listening) {
      setTimeout(() => this.start_listening(on_command), 120);
      return;
    }

    try {
      this.recognition.start();
      this.is_listening = true;
    } catch {
      setTimeout(() => this.start_listening(on_command), 120);
    }
  }

  async stop_listening(): Promise<void> {
    if (is_native()) {
      await SpeechRecognition.stop();
      this.is_listening = false;
      return;
    }

    try {
      this.recognition?.stop();
    } catch { }
    this.is_listening = false;
  }

  speak(text: string, on_end?: () => void): void {
    this.stop_listening();
    this.is_listening = false;
    this.synthesis.cancel();
    const clean = text.replace(/<[^>]*>/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      if (on_end) on_end();
      this.on_speak_end_callback?.();
    };

    this.synthesis.speak(utterance);
  }

  stop_speaking(): void {
    this.synthesis.cancel();
  }

  on_speak_end(cb: () => void): void {
    this.on_speak_end_callback = cb;
  }

  is_supported(): boolean {
    return is_native() || !!this.recognition;
  }

  on_wake_word(callback: () => void) {
    this.on_wake_word_callback = callback;
  }

  on_command(callback: (command: string) => void) {
    this.on_command_callback = callback;
  }

  on_listening_change(callback: (isListening: boolean) => void) {
    this.on_listening_state_change = callback;
  }
}

export const voiceService = new VoiceService();
