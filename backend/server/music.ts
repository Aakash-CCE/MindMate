import { GoogleGenAI } from '@google/genai';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

export interface GenerateMusicParams {
  prompt: string;
  modelType: 'clip' | 'pro'; // clip = lyria-3-clip-preview (up to 30s), pro = lyria-3-pro-preview (full track)
  mood?: string;
}

export interface GeneratedMusicResult {
  audioBase64: string;
  mimeType: string;
  lyrics?: string;
  durationSeconds: number;
  model: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  isFallback?: boolean;
  message?: string;
}

/**
 * Generate a soothing WAV audio buffer synthetically (peaceful ambient harmonic chord)
 * Used as high-reliability graceful fallback when Gemini key is missing or quota is restricted.
 */
export function generateSyntheticCalmAudio(durationSec = 15, mood = 'peaceful'): { audioBase64: string; mimeType: string } {
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSec;
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Frequencies for a soft Solfeggio / meditative chord (528Hz Love/Calm, 396Hz Grounding, 432Hz Harmony)
  const freqs = mood.toLowerCase().includes('sleep')
    ? [174, 285, 396] // Deep sleep / delta drone
    : mood.toLowerCase().includes('vitality') || mood.toLowerCase().includes('uplift')
    ? [330, 440, 554, 659] // Uplifting A-major triad
    : [261.63, 329.63, 392.0, 523.25]; // Warm C-major serenity

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Envelope: gentle fade in (3s) and fade out (3s)
    let env = 1.0;
    if (t < 3) env = t / 3;
    else if (t > durationSec - 3) env = Math.max(0, (durationSec - t) / 3);

    // Subtle gentle tremolo / breathing wave (0.2 Hz)
    const lfo = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.15 * t);

    // Sum frequencies
    let sample = 0;
    for (let f = 0; f < freqs.length; f++) {
      const weight = 1 / (f + 1.2);
      sample += weight * Math.sin(2 * Math.PI * freqs[f] * t);
    }
    sample = (sample / freqs.length) * env * lfo * 0.45;

    // Clamp to 16-bit
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return {
    audioBase64: buffer.toString('base64'),
    mimeType: 'audio/wav',
  };
}

export async function generateLyriaMusic(params: GenerateMusicParams): Promise<GeneratedMusicResult> {
  const modelName = params.modelType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
  const duration = params.modelType === 'pro' ? 120 : 30;

  const ai = getGenAI();
  if (!ai) {
    console.warn('GEMINI_API_KEY is not set or placeholder. Returning high quality meditative audio.');
    const fallback = generateSyntheticCalmAudio(Math.min(duration, 30), params.mood || 'peaceful');
    return {
      audioBase64: fallback.audioBase64,
      mimeType: fallback.mimeType,
      durationSeconds: Math.min(duration, 30),
      model: modelName,
      isFallback: true,
      message: 'Generated using MindMate offline soundscape generator. To enable real-time Lyria AI music, set your Gemini API key in Settings > Secrets > GEMINI_API_KEY.',
    };
  }

  try {
    const promptText = `Generate a calming, therapeutic emotional wellness soundtrack: ${params.prompt}. Style: peaceful, soothing, high acoustic quality, relaxing ambient harmony.`;

    const response = await ai.models.generateContentStream({
      model: modelName,
      contents: promptText,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      throw new Error('Lyria model returned no audio chunks.');
    }

    return {
      audioBase64,
      mimeType,
      lyrics: lyrics || undefined,
      durationSeconds: duration,
      model: modelName,
      isFallback: false,
    };
  } catch (error: any) {
    console.error(`Lyria music generation failed with ${modelName}:`, error);

    // Check for common permission or quota errors
    const errorMsg = error?.message || String(error);
    const isPaidQuota = errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('429');
    const isPermission = errorMsg.includes('PERMISSION_DENIED') || errorMsg.includes('403') || errorMsg.includes('API_KEY_INVALID');

    const fallback = generateSyntheticCalmAudio(Math.min(duration, 30), params.mood || 'peaceful');
    return {
      audioBase64: fallback.audioBase64,
      mimeType: fallback.mimeType,
      durationSeconds: Math.min(duration, 30),
      model: modelName,
      isFallback: true,
      message: isPaidQuota
        ? 'Lyria requires a paid tier Gemini API key (Resource Exhausted). Provided offline ambient soundscape as preview.'
        : isPermission
        ? 'Lyria requires a valid API key with model permissions. Provided offline ambient soundscape as preview.'
        : `Lyria service temporarily unavailable (${errorMsg.slice(0, 100)}). Provided offline ambient soundscape as preview.`,
    };
  }
}
