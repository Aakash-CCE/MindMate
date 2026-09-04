import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HTTPServer } from 'http';
import type { IncomingMessage } from 'http';

const LIVE_MODEL = 'gemini-3.1-flash-live-preview';

const SYSTEM_PROMPT = `You are MindMate, a warm, compassionate, and attentive AI emotional wellness companion speaking directly with the user through live voice.

Your voice demeanor:
- Gentle, calm, supportive, and natural.
- Speak in conversational, succinct spoken sentences (1-3 sentences per turn), not lengthy monologues or long bullet lists.
- Listen deeply, validate feelings warmly, and provide gentle grounding or reflection.
- If the user feels overwhelmed or stressed, guide them through a gentle slow breath or calming thought.
- You are not a licensed therapist or doctor. If someone is in crisis, gently direct them to 988 or immediate human support.`;

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

let wssInstance: WebSocketServer | null = null;

export function setupLiveWebSocketServer(server: any): WebSocketServer {
  if (wssInstance) {
    return wssInstance;
  }

  const wss = new WebSocketServer({ noServer: true });
  wssInstance = wss;

  server.on('upgrade', (request: IncomingMessage, socket, head) => {
    const pathname = request.url ? new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname : '';
    if (pathname === '/api/live-ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
    const chosenVoice = url.searchParams.get('voice') || 'Zephyr'; // 'Zephyr', 'Kore', 'Puck', 'Charon', 'Fenrir'
    const companionName = url.searchParams.get('companion') || 'MindMate';

    const ai = getGenAI();
    if (!ai) {
      clientWs.send(
        JSON.stringify({
          type: 'error',
          error: 'GEMINI_API_KEY is not configured on the server. Please add your key in Settings > Secrets to use live voice with gemini-3.1-flash-live-preview.',
          code: 'NO_API_KEY',
        })
      );
      return;
    }

    let liveSession: any = null;
    let isClosed = false;

    try {
      clientWs.send(
        JSON.stringify({
          type: 'status',
          status: 'connecting',
          message: `Connecting to ${companionName} via Live API (gemini-3.1-flash-live-preview)...`,
        })
      );

      liveSession = await ai.live.connect({
        model: LIVE_MODEL,
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;

            // Handle generated audio parts
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts && parts.length > 0) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'audio',
                      audio: part.inlineData.data, // 24kHz PCM base64
                    })
                  );
                }
                if (part.text) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'transcript',
                      role: 'assistant',
                      text: part.text,
                    })
                  );
                }
              }
            }

            // User audio transcription if provided by the model
            const inputTranscription = (message.serverContent as any)?.inputAudioTranscription?.text;
            if (inputTranscription) {
              clientWs.send(
                JSON.stringify({
                  type: 'transcript',
                  role: 'user',
                  text: inputTranscription,
                })
              );
            }

            // Output audio transcription if provided separately
            const outputTranscription = (message.serverContent as any)?.outputAudioTranscription?.text;
            if (outputTranscription) {
              clientWs.send(
                JSON.stringify({
                  type: 'transcript',
                  role: 'assistant',
                  text: outputTranscription,
                })
              );
            }

            // Interruption signal (user began speaking while model was outputting audio)
            if (message.serverContent?.interrupted) {
              clientWs.send(
                JSON.stringify({
                  type: 'interrupted',
                  message: 'User interrupted playback',
                })
              );
            }

            // Turn completion
            if (message.serverContent?.turnComplete) {
              clientWs.send(
                JSON.stringify({
                  type: 'turn_complete',
                })
              );
            }
          },
          onclose: (event) => {
            if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  type: 'status',
                  status: 'closed',
                  message: 'Live session closed.',
                })
              );
            }
          },
          onerror: (err: any) => {
            console.error('Live API connection error:', err);
            if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  type: 'error',
                  error: err?.message || 'Live audio session encountered an error.',
                })
              );
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: chosenVoice,
              },
            },
          },
          systemInstruction: `${SYSTEM_PROMPT}\nYour companion persona name is ${companionName}.`,
        },
      });

      clientWs.send(
        JSON.stringify({
          type: 'status',
          status: 'ready',
          model: LIVE_MODEL,
          voice: chosenVoice,
          message: `Live session active with ${companionName}.`,
        })
      );
    } catch (err: any) {
      console.error('Failed to establish Live API connection:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: 'error',
            error: err?.message || 'Could not connect to Gemini Live API. Please check your API key and quotas in Settings > Secrets.',
            code: 'CONNECT_FAILED',
          })
        );
      }
      return;
    }

    // Client message handling
    clientWs.on('message', (rawData) => {
      if (isClosed || !liveSession) return;
      try {
        const payload = JSON.parse(rawData.toString());

        if (payload.type === 'ping') {
          clientWs.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        // Realtime 16kHz PCM audio from browser microphone
        if (payload.audio) {
          liveSession.sendRealtimeInput({
            audio: {
              data: payload.audio, // base64 encoded 16-bit PCM at 16000Hz
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        }

        // Text input into the live session
        if (payload.text) {
          liveSession.sendRealtimeInput({
            text: payload.text,
          });
        }
      } catch (parseErr) {
        console.warn('Error processing client WebSocket message:', parseErr);
      }
    });

    clientWs.on('close', () => {
      isClosed = true;
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          // ignore cleanup errors
        }
      }
    });

    clientWs.on('error', (err) => {
      console.warn('Client WebSocket error:', err);
      isClosed = true;
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          // ignore
        }
      }
    });
  });

  return wss;
}
