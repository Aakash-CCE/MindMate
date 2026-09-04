// Audio utilities for Live API (PCM 16kHz input, PCM 24kHz output) and Lyria playback

/**
 * Converts a Float32Array of audio samples from Web Audio API into
 * a 16-bit PCM base64 string at 16,000 Hz.
 */
export function downsampleAndEncodePCM16(
  inputBuffer: Float32Array,
  inputSampleRate: number,
  targetSampleRate = 16000
): string {
  if (inputBuffer.length === 0) return '';

  const sampleRatio = inputSampleRate / targetSampleRate;
  const newLength = Math.round(inputBuffer.length / sampleRatio);
  const result = new Int16Array(newLength);

  let offsetResult = 0;
  let offsetInput = 0;

  while (offsetResult < result.length) {
    const nextOffsetInput = Math.round((offsetResult + 1) * sampleRatio);
    // Average samples across the window
    let accum = 0;
    let count = 0;
    for (let i = offsetInput; i < nextOffsetInput && i < inputBuffer.length; i++) {
      accum += inputBuffer[i];
      count++;
    }

    const avg = count > 0 ? accum / count : 0;
    // Clamp to 16-bit integer range [-32768, 32767]
    const s = Math.max(-1, Math.min(1, avg));
    result[offsetResult] = s < 0 ? s * 0x8000 : s * 0x7fff;

    offsetResult++;
    offsetInput = nextOffsetInput;
  }

  // Convert Int16Array to binary string
  const bytes = new Uint8Array(result.buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Class managing gapless playback of 24kHz 16-bit PCM audio chunks from Live API
 */
export class LiveAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private isPlaying = false;
  private onPlaybackStateChange?: (isPlaying: boolean) => void;

  constructor(onPlaybackStateChange?: (isPlaying: boolean) => void) {
    this.onPlaybackStateChange = onPlaybackStateChange;
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: 24000 });
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Schedules a 24kHz raw PCM base64 chunk for gapless playback
   */
  public playChunk(base64Data: string) {
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 16-bit signed integer PCM
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const audioBuffer = this.audioCtx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioCtx.destination);

      const currentTime = this.audioCtx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      this.activeSources.push(source);

      if (!this.isPlaying) {
        this.isPlaying = true;
        this.onPlaybackStateChange?.(true);
      }

      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
        if (this.activeSources.length === 0) {
          this.isPlaying = false;
          this.onPlaybackStateChange?.(false);
        }
      };
    } catch (err) {
      console.error('Error decoding/playing Live API audio chunk:', err);
    }
  }

  /**
   * Immediately stops all currently playing and queued chunks (called when user interrupts)
   */
  public interrupt() {
    for (const src of this.activeSources) {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // ignore already stopped
      }
    }
    this.activeSources = [];
    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    }
    if (this.isPlaying) {
      this.isPlaying = false;
      this.onPlaybackStateChange?.(false);
    }
  }

  public close() {
    this.interrupt();
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}
