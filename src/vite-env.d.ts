import type { NoteEvent } from '../music/types';

function toUint8Array(data: number[]): Uint8Array {
  return new Uint8Array(data);
}

function writeVarLen(value: number): number[] {
  const buffer: number[] = [];
  let remaining = value & 0x7fffffff;
  while (true) {
    const byte = remaining & 0x7f;
    remaining >>= 7;
    if (remaining !== 0) {
      buffer.push((byte | 0x80) & 0xff);
    } else {
      buffer.push(byte);
      break;
    }
  }
  return buffer;
}

export function serializeMidi(events: NoteEvent[], tempo = 120): Uint8Array {
  const ticksPerQuarter = 480;
  const sorted = [...events].sort((a, b) => a.time - b.time);
  const track: number[] = [];

  const tempoMicroseconds = Math.round(60000000 / tempo);
  track.push(0x00, 0xff, 0x51, 0x03);
  track.push((tempoMicroseconds >> 16) & 0xff, (tempoMicroseconds >> 8) & 0xff, tempoMicroseconds & 0xff);

  let currentTick = 0;
  const noteOnById = new Map<string, number>();

  for (const event of sorted) {
    const targetTick = Math.round((event.time * tempo * ticksPerQuarter) / 60);
    const delta = Math.max(0, targetTick - currentTick);
    currentTick = targetTick;

    track.push(...writeVarLen(delta));
    const statusByte = 0x90 + (event.channel % 16);
    const velocity = Math.max(1, Math.min(127, Math.round(event.velocity * 127)));
    track.push(statusByte, event.note % 128, velocity);
    noteOnById.set(event.id, targetTick);

    const endTick = Math.round(((event.time + event.duration) * tempo * ticksPerQuarter) / 60);
    const durationDelta = Math.max(0, endTick - targetTick);
    track.push(...writeVarLen(durationDelta));
    track.push((0x80 + (event.channel % 16)) & 0xff, event.note % 128, 0x00);
    currentTick = endTick;
  }

  const trackLength = track.length + 4 + 4;
  const midiBytes = [
    0x4d, 0x54, 0x68, 0x64,
    0x00, 0x00, 0x00, 0x06,
    0x00, 0x00,
    0x00, 0x01,
    0x00, 0x00,
    0x00, 0x00,
    0x4d, 0x54, 0x72, 0x6b,
    (trackLength >> 24) & 0xff,
    (trackLength >> 16) & 0xff,
    (trackLength >> 8) & 0xff,
    trackLength & 0xff,
    ...track,
    0x00, 0xff, 0x2f, 0x00,
  ];

  return toUint8Array(midiBytes);
}
