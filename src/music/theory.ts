export type ScaleMode = 'major' | 'minor' | 'dorian' | 'mixolydian' | 'phrygian' | 'aeolian';
export type Style = 'ambient' | 'cinematic' | 'deep-house' | 'techno' | 'lo-fi' | 'jazz' | 'neo-classical' | 'synthwave' | 'minimal' | 'experimental';
export type Instrument = 'bass' | 'lead' | 'pad' | 'pluck' | 'kick' | 'hihat';

export interface GeneratorSettings {
  tempo: number;
  key: number;
  mode: ScaleMode;
  style: Style;
  energy: number;
  complexity: number;
  novelty: number;
  mood: string;
  density: number;
}

export interface NoteEvent {
  id: string;
  time: number;
  duration: number;
  note: number;
  velocity: number;
  instrument: Instrument;
  channel: number;
}

export interface Phrase {
  bars: number;
  key: number;
  mode: ScaleMode;
  events: NoteEvent[];
}
