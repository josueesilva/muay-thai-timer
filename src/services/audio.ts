import { Audio } from 'expo-av';
import { File, Paths } from 'expo-file-system/next';

const BELL_ASSET = require('../../assets/bell.mp3');

// ─── WAV synthesis (end-of-round bell tone) ───────────────────────────────────

function writeChunkId(view: DataView, offset: number, id: string): void {
  for (let i = 0; i < id.length; i++) {
    view.setUint8(offset + i, id.charCodeAt(i));
  }
}

function buildBellWAV(frequency: number, durationSec: number, sampleRate = 8000): Uint8Array {
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new ArrayBuffer(44 + numSamples);
  const view = new DataView(buffer);

  writeChunkId(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples, true);
  writeChunkId(view, 8, 'WAVE');
  writeChunkId(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);        // PCM
  view.setUint16(22, 1, true);        // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate, true); // byte rate = sampleRate * 1 byte * 1 channel
  view.setUint16(32, 1, true);        // block align
  view.setUint16(34, 8, true);        // bits per sample
  writeChunkId(view, 36, 'data');
  view.setUint32(40, numSamples, true);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const decay = Math.exp(-t * 4);
    const wave =
      0.5 * Math.sin(2 * Math.PI * frequency * t) +
      0.3 * Math.sin(2 * Math.PI * frequency * 2.76 * t) +
      0.2 * Math.sin(2 * Math.PI * frequency * 5.4 * t);
    view.setUint8(44 + i, Math.round(128 + 100 * wave * decay));
  }

  return new Uint8Array(buffer);
}

// ─── Playback helpers ─────────────────────────────────────────────────────────

async function playAsset(asset: ReturnType<typeof require>): Promise<void> {
  const { sound } = await Audio.Sound.createAsync(asset);
  await sound.playAsync();
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
  });
}

async function playGeneratedWAV(bytes: Uint8Array, cacheKey: string): Promise<void> {
  const file = new File(Paths.cache, `${cacheKey}.wav`);
  file.write(bytes);
  const { sound } = await Audio.Sound.createAsync({ uri: file.uri });
  await sound.playAsync();
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) sound.unloadAsync();
  });
}

function safePlay(fn: () => Promise<void>): void {
  fn().catch(() => {});
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function playStartSound(): void {
  safePlay(() => playAsset(BELL_ASSET));
}

export function playEndSound(): void {
  safePlay(() => playGeneratedWAV(buildBellWAV(520, 1.5), 'end_bell'));
}

export async function initAudio(): Promise<void> {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
  });
}
