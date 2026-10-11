import { buildChord, chooseProgression, clamp, getScaleDegrees, midiToFrequency } from './theory';
import type { GeneratorSettings, NoteEvent, Phrase } from './types';

export class ProceduralComposer {
  private settings: GeneratorSettings;
  private phraseIndex = 0;

  constructor(settings: GeneratorSettings) {
    this.settings = settings;
  }

  updateSettings(settings: GeneratorSettings): void {
    this.settings = settings;
  }

  generatePhrase(bars = 4): NoteEvent[] {
    const beatDuration = 60 / this.settings.tempo;
    const barDuration = beatDuration * 4;
    const stepDuration = beatDuration / 2;

    const root = this.settings.key;
    const scale = getScaleDegrees(root, this.settings.mode);
    const progression = chooseProgression(root, this.settings.mode);
    const events: NoteEvent[] = [];
    const phraseSeed = this.phraseIndex + 1;

    for (let bar = 0; bar < bars; bar++) {
      const chordRoot = progression[(bar + this.phraseIndex) % progression.length] ?? root;
      const chord = buildChord(chordRoot, this.settings.style === 'cinematic' ? 'maj7' : 'min7');

      for (let beat = 0; beat < 4; beat++) {
        const time = bar * barDuration + beat * beatDuration;
        const bassNote = chord[0] - 12 + (beat % 2 === 0 ? 0 : 12);
        events.push({
          id: `bass-${phraseSeed}-${bar}-${beat}`,
          time,
          duration: beatDuration * 0.9,
          note: bassNote,
          velocity: 0.72,
          instrument: 'bass',
          channel: 0,
        });

        const padTarget = chord[(beat + this.phraseIndex) % chord.length] ?? chord[0];
        events.push({
          id: `pad-${phraseSeed}-${bar}-${beat}`,
          time: time + beatDuration * 0.25,
          duration: beatDuration * 1.4,
          note: padTarget,
          velocity: 0.38,
          instrument: 'pad',
          channel: 1,
        });

        for (let sub = 0; sub < 2; sub++) {
          const stepTime = time + beatDuration * (sub / 2) + stepDuration * (this.settings.density * 0.5 + 0.1);
          const scaleIndex = ((bar * 2 + beat + sub + this.phraseIndex) % scale.length + scale.length) % scale.length;
          const leadNote = scale[scaleIndex] + (this.settings.energy > 0.6 ? 12 : 0) + (beat % 2 === 0 ? 0 : 12);
          events.push({
            id: `lead-${phraseSeed}-${bar}-${beat}-${sub}`,
            time: stepTime,
            duration: stepDuration * (1.35 - this.settings.novelty * 0.35),
            note: clamp(leadNote, 48, 83),
            velocity: 0.52 + this.settings.energy * 0.34,
            instrument: 'lead',
            channel: 2,
          });
        }
      }

      if (this.settings.style !== 'ambient') {
        const kickStart = bar * barDuration + this.settings.tempo / 200;
        events.push({
          id: `kick-${phraseSeed}-${bar}`,
          time: kickStart,
          duration: 0.18,
          note: 36,
          velocity: 0.9,
          instrument: 'kick',
          channel: 9,
        });

        if (bar % 2 === 0) {
          events.push({
            id: `hihat-${phraseSeed}-${bar}`,
            time: bar * barDuration + 0.5,
            duration: 0.09,
            note: 70,
            velocity: 0.48,
            instrument: 'hihat',
            channel: 9,
          });
        }
      }
    }

    this.phraseIndex += 1;
    return events.sort((a, b) => a.time - b.time);
  }

  createPhraseMetadata(): Phrase {
    return {
      bars: 4,
      key: this.settings.key,
      mode: this.settings.mode,
      events: this.generatePhrase(4),
    };
  }
}
