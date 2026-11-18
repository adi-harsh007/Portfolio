/**
 * Ghost of Yōtei Web Audio Synthesizer
 * Zero-dependency procedural Japanese soundscape:
 * - Howling mountain wind generator (pink noise + LFO resonant filter)
 * - Katana draw / blade slice (metallic resonance ring)
 * - Taiko drum boom (sub-bass pitch drop)
 * - Shamisen / Koto pentatonic plucks (Insen scale)
 */

export class YoteiAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isInitialized = false;

    // Wind ambient nodes
    this.windGain = null;
    this.windFilter = null;
  }

  init() {
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.isInitialized = true;

      // Start ambient wind loop
      this.startWindAmbience();

      // Play soft entrance koto chord
      setTimeout(() => this.playKotoChord(), 600);
    } catch (e) {
      console.warn('Web Audio not allowed yet or unsupported', e);
    }
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.windGain) {
      this.windGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.045, this.ctx.currentTime, 0.2);
    }
    return this.isMuted;
  }

  // 1. Procedural Mountain Wind Ambience (Pink Noise + Lowpass LFO)
  startWindAmbience() {
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise generation
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

    // Resonant Filter modulated by LFO for whistling gust effect
    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'lowpass';
    this.windFilter.frequency.setValueAtTime(260, this.ctx.currentTime);
    this.windFilter.Q.setValueAtTime(4.2, this.ctx.currentTime);

    // Filter frequency LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime); // slow rolling gust
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.windFilter.frequency);
    lfo.start();

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(this.isMuted ? 0 : 0.042, this.ctx.currentTime);

    whiteNoise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.ctx.destination);

    whiteNoise.start();
  }

  // 2. Katana Blade Slice / Metallic Draw (Shing!)
  playBladeSlash() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // High metal tone 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(2800, t);
    osc1.frequency.exponentialRampToValueAtTime(1900, t + 0.18);
    gain1.gain.setValueAtTime(0.08, t);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.36);

    // High metal harmonic 2 (ringing blade)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(4200, t);
    osc2.frequency.exponentialRampToValueAtTime(3200, t + 0.25);
    gain2.gain.setValueAtTime(0.04, t);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.46);

    // Friction air swoosh (Filtered noise burst)
    const swoosh = this.createNoiseBurst(0.12, 1200, 0.05);
  }

  // 3. Taiko Drum Strike (Boom!)
  playTaikoDrum() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub-bass pitch dive
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.38);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.86);

    // Attack Transient Click/Thump
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(240, t);
    clickOsc.frequency.exponentialRampToValueAtTime(50, t + 0.06);

    clickGain.gain.setValueAtTime(0.25, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    clickOsc.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.08);
  }

  // 4. Koto / Shamisen Pentatonic Pluck (Insen scale: D, Eb, G, A, C)
  playKotoNote(freq = 293.66, timeOffset = 0) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime + timeOffset;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Pluck filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 5, t);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, t + 0.4);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.25);
  }

  playKotoChord() {
    // Insen traditional pentatonic chord arpeggio: D4, Eb4, G4, A4
    const scale = [293.66, 311.13, 392.00, 440.00];
    scale.forEach((note, idx) => {
      this.playKotoNote(note, idx * 0.12);
    });
  }

  createNoiseBurst(duration, cutoff, volume) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    whiteNoise.stop(this.ctx.currentTime + duration);
  }
}

