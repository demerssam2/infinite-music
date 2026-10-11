* {
  box-sizing: border-box;
}

:root {
  color-scheme: dark;
  --bg: #0a0d12;
  --panel: rgba(18, 23, 31, 0.92);
  --panel-alt: rgba(29, 35, 44, 0.9);
  --line: rgba(151, 170, 204, 0.24);
  --text: #edf3ff;
  --muted: #a8b4c9;
  --accent: #9cc9ff;
  --accent-soft: rgba(156, 201, 255, 0.18);
  --highlight: #77f1d1;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(96, 124, 175, 0.16), transparent 25%),
    linear-gradient(180deg, #070b10 0%, #0a0d12 100%);
  color: var(--text);
  font-family: Inter, 'Segoe UI', sans-serif;
}

body {
  min-height: 100vh;
}

button, input, select {
  font: inherit;
}

.app-shell {
  display: grid;
  grid-template-columns: 340px 1fr;
  min-height: 100vh;
  gap: 20px;
  padding: 24px;
}

.panel,
.main-stage > * {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.26);
}

.side-panel {
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.brand-block h1, .status-row h2, .status-row h3 {
  margin: 0;
}

.eyebrow {
  display: block;
  font-size: 11px; 
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--muted);
  margin-bottom: 8px;
}

.control-group {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.primary-button, .secondary-button {
  border-radius: 12px;
  border: 1px solid var(--line);
  cursor: pointer;
  padding: 10px 14px;
  color: var(--text);
  transition: transform 0.18s ease, border-color 0.18s ease;
}

.primary-button {
  flex: 1;
  background: linear-gradient(180deg, rgba(117, 177, 255, 0.32), rgba(117, 177, 255, 0.18));
}

.secondary-button {
  background: rgba(255, 255, 255, 0.02);
}

.primary-button:hover, .secondary-button:hover {
  transform: translateY(-1px);
  border-color: rgba(156, 201, 255, 0.55);
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--muted);
}

input[type='range'] {
  width: 100%;
  accent-color: var(--highlight);
}

input[type='text'], select {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--text);
  padding: 9px 10px;
}

.slider-grid {
  display: grid;
  gap: 14px;
}

.main-stage {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.visualizer-panel, .timeline-panel {
  padding: 18px;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.visualizer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 8px;
  min-height: 260px;
  padding: 16px 10px 8px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(108, 134, 176, 0.13), rgba(52, 64, 78, 0.05));
  border: 1px solid var(--line);
  overflow: hidden;
}

.bar {
  flex: 1;
  border-radius: 999px 999px 0 0;
  background: linear-gradient(180deg, rgba(119, 241, 209, 0.92), rgba(156, 201, 255, 0.45));
  min-height: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 14px;
}

.info-card {
  padding: 16px 18px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--line);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  color: var(--muted);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  color: var(--muted);
  margin-bottom: 16px;
}

.timeline {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.pulse {
  height: 18px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(156, 201, 255, 0.18), rgba(119, 241, 209, 0.7));
  border: 1px solid rgba(119, 241, 209, 0.4);
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
