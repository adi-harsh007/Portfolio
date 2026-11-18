/**
 * Ghost of Yōtei Procedural Web Audio Engine for "Path of the Ronin"
 * Synthesizes authentic Japanese acoustic textures without external audio files:
 * - Howling mountain wind ambience (pink noise + LFO resonant filter)
 * - Footsteps on gravel/stone (filtered noise bursts)
 * - Katana draw / metallic ring
 * - Taiko drum boom (sub-bass drop)
 * - Koto / Shamisen pentatonic plucks (Insen scale: D, Eb, G, A, C)
 */

import { state } from './state.js';

class GameAudioEngine {
  constructor() {
    this.ctx = null;
    this.isInitialized = false;
    this.windGain = null;
    this.windFilter = null;
    this.windLfo = null;
    
    // Pentatonic Insen Scale frequencies (Hz) across two octaves
    this.insenScale = [
      146.83, 155.56, 196.00, 220.00, 261.63, // D3, Eb3, G3, A3, C4
      293.66, 311.13, 392.00, 440.00, 523.25, // D4, Eb4, G4, A4, C5
      587.33, 622.25, 783.99, 880.00, 1046.50 // D5, Eb5, G5, A5, C6
    ];
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.isInitialized = true;
      this.startWindAmbience();
    } catch (e) {
      console.warn('Web Audio not allowed or unsupported', e);
    }
  }

  ensureContext() {
    if (!this.isInitialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleAudio() {
    this.ensureContext();
    state.audioEnabled = !state.audioEnabled;
    if (this.windGain && this.ctx) {
      const targetGain = state.audioEnabled ? 0.045 : 0;
      this.windGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
    }
    if (state.audioEnabled) {
      this.playKotoNote(7); // Welcome koto chime
    }
    return state.audioEnabled;
  }

  // 1. Procedural Mountain Wind (Pink Noise + Rolling LFO Filter)
  startWindAmbience() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'lowpass';
    this.windFilter.frequency.setValueAtTime(260, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(3.8, this.ctx.currentTime);

    this.windLfo = this.ctx.createOscillator();
    this.windLfo.frequency.setValueAtTime(0.16, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(130, this.ctx.currentTime);
    this.windLfo.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);
    this.windLfo.start();

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(state.audioEnabled ? 0.045 : 0, this.ctx.currentTime);

    whiteNoise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.ctx.destination);
    whiteNoise.start();
  }

  // 2. Footstep SFX (Soft gravel / grass contact)
  playFootstep() {
    if (!state.audioEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(180 + Math.random() * 40, now);
      filter.Q.setValueAtTime(2.5, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.05);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.048);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // 3. Jump Whoosh (Air turbulence)
  playJump() {
    if (!state.audioEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // 4. Koto Pluck (Authentic resonant Japanese zither string)
  playKotoNote(noteIndex = 5) {
    if (!state.audioEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const freq = this.insenScale[noteIndex % this.insenScale.length];

      // Primary string oscillator
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Bright harmonic overtones
      const overtone = this.ctx.createOscillator();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2.01, now);

      // Resonant body filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3.8, now);
      filter.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.8);
      filter.Q.setValueAtTime(5.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      const overGain = this.ctx.createGain();
      overGain.gain.setValueAtTime(0.04, now);
      overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      overtone.connect(overGain);
      overGain.connect(this.ctx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 1.15);
      overtone.stop(now + 0.45);
    } catch (e) {}
  }

  // 5. Taiko Drum Boom (Sub-bass strike on transition / shrine enter)
  playTaikoBoom() {
    if (!state.audioEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.55);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {}
  }

  // 6. Katana Ring (Metallic blade slice)
  playKatanaRing() {
    if (!state.audioEnabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1420, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.08);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {}
  }
}

export const gameAudio = new GameAudioEngine();

