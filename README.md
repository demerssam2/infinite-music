# Infinite Music

A browser-native procedural music generator built with React, TypeScript, and the Web Audio API.

## Features

- local, real-time music generation in the browser
- MIDI-like event representation
- smooth playback scheduling with Web Audio
- composition engine with key, scale, style, and mood controls
- exported MIDI files from generated phrases
- responsive dark interface

## Getting started

```bash
npm install
npm run dev
```

Then open the Vite URL in your browser and press play.

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Architecture

- `src/music/` contains the composition engine and music theory helpers.
- `src/audio/` handles audio scheduling and synthesis.
- `src/export/` serializes generated passages to MIDI.
- `src/App.tsx` contains the playlist controls and interface.
