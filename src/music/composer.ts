import type { ScaleMode } from './types';

export const SCALE_MODES: Record<ScaleMode, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
};

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiToNoteName(midi: number): string {
  const note = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function getScaleDegrees(root: number, mode: ScaleMode): number[] {
  return SCALE_MODES[mode].map((interval) => root + interval);
}

export function isWithinScale(note: number, root: number, mode: ScaleMode): boolean {
  const degrees = getScaleDegrees(root, mode);
  const normalized = ((note - root) % 12 + 12) % 12;
  return degrees.includes(normalized);
}

export function getChordName(rootMidi: number, mode: ScaleMode, degree: number): string {
  const rootNote = midiToNoteName(rootMidi);
  const degreeOffset = degree % 4;
  const qualityMap = {
    0: 'maj7',
    1: mode === 'major' || mode === 'dorian' || mode === 'mixolydian' ? 'min7' : 'min7',
    2: 'sus4',
    3: 'dim7',
  };

  const quality = qualityMap[degreeOffset as keyof typeof qualityMap] ?? 'maj7';
  return `${rootNote}${quality}`;
}

export function buildChord(rootMidi: number, quality: 'maj' | 'min' | 'sus2' | 'sus4' | 'dim' | 'maj7' | 'min7' = 'maj7'): number[] {
  const bass = rootMidi;
  const third = rootMidi + (quality.startsWith('min') ? 3 : 4);
  const fifth = rootMidi + 7;
  const seventh = quality.endsWith('7') ? rootMidi + 10 : rootMidi + 12;

  return [bass, third, fifth, seventh];
}

export function chooseProgression(rootMidi: number, mode: ScaleMode): number[] {
  const modeMap: Record<ScaleMode, number[]> = {
    major: [0, 5, 3, 4],
    minor: [0, 6, 3, 4],
    dorian: [0, 3, 4, 5],
    mixolydian: [0, 5, 3, 2],
    phrygian: [0, 4, 5, 3],
    aeolian: [0, 6, 3, 4],
  };

  return modeMap[mode].map((degree) => rootMidi + (SCALE_MODES[mode][degree % SCALE_MODES[mode].length] ?? 0));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
