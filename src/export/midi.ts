import { midiToFrequency } from '../music/theory';
import type { NoteEvent } from '../music/types';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nextEventTime = 0;
  private tempo = 108;

  constructor() {
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.32;
    this.masterGain.connect(this.audioContext.destination);
  }

  setTempo(tempo: number): void {
    this.tempo = tempo;
  }

  async ensureReady(): Promise<void> {
    if (!this.audioContext) return;
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  playPhrase(events: NoteEvent[]): void {
    if (!this.audioContext || !this.masterGain) return;

    const startupTime = Math.max(this.audioContext.currentTime + 0.05, this.nextEventTime);
    const phraseEnd = events.reduce((max, event) => Math.max(max, event.time + event.duration), 0);

    for (const event of events) {
      const start = startupTime + event.time;
      const end = start + event.duration;
      this.triggerVoice(event, start, end);
    }

    this.nextEventTime = startupTime + phraseEnd + 0.12;
  }

  private triggerVoice(event: NoteEvent, start: number, end: number): void {
    if (!this.audioContext || !this.masterGain) return;

    switch (event.instrument) {
      case 'bass':
        this.triggerOscillator('sawtooth', event.note, 0.06, start, end, 0.18, 0.7);
        break;
      case 'lead':
        this.triggerOscillator('square', event.note, 0.08, start, end, 0.1, 0.42);
        break;
      case 'pad':
        this.triggerOscillator('triangle', event.note, 0.22, start, end, 0.08, 0.28);
        break;
      case 'pluck':
        this.triggerOscillator('sine', event.note, 0.06, start, end, 0.09, 0.35);
        break;
      case 'kick':
        this.triggerKick(start, end);
        break;
      case 'hihat':
        this.triggerHihat(start, end);
        break;
      default:
        break;
    }
  }

  private triggerOscillator(
    type: OscillatorType,
    midiNote: number,
    attack: number,
    start: number,
    end: number,
    release: number,
    gainValue: number,
  ): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(midiToFrequency(midiNote), start);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, start);
    filter.Q.value = 1.2;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(gainValue, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, end + release);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(start);
    osc.stop(end + release + 0.04);
  }

  private triggerKick(start: number, end: number): void {
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, start);
    osc.frequency.exponentialRampToValueAtTime(30, end);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.72, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(start);
    osc.stop(end + 0.04);
  }

  private triggerHihat(start: number, end: number): void {
    if (!this.audioContext || !this.masterGain) return;

    const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.08, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    }

    const source = this.audioContext.createBufferSource();
    const highpass = this.audioContext.createBiquadFilter();
    const gain = this.audioContext.createGain();

    source.buffer = buffer;
    highpass.type = 'highpass';
    highpass.frequency.value = 6500;
    gain.gain.setValueAtTime(0.18, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    source.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.masterGain);

    source.start(start);
    source.stop(end + 0.02);
  }
}
