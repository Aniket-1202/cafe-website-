import { PlaylistTrack } from '../data/cafeData';

class CafeAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private intervalId: number | null = null;
  private stepIndex = 0;
  private isPlaying = false;
  private volume = 0.42;
  private currentTrack: PlaylistTrack | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume * 0.28;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume * 0.28, this.ctx.currentTime, 0.08);
    }
  }

  public start(track: PlaylistTrack) {
    this.currentTrack = track;
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    this.stopTimer();
    this.isPlaying = true;
    this.stepIndex = 0;
    this.playChordStep();

    const beatMs = (60 / track.bpm) * 1000 * 4;
    this.intervalId = window.setInterval(() => {
      if (this.isPlaying) {
        this.playChordStep();
      }
    }, beatMs);
  }

  public stop() {
    this.isPlaying = false;
    this.stopTimer();
  }

  public switchTrack(track: PlaylistTrack, shouldPlay: boolean) {
    this.currentTrack = track;
    if (shouldPlay) {
      this.start(track);
    }
  }

  private stopTimer() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private playChordStep() {
    if (!this.ctx || !this.masterGain || !this.currentTrack) return;
    const now = this.ctx.currentTime;
    const chord = this.currentTrack.chords[this.stepIndex % this.currentTrack.chords.length];
    this.stepIndex += 1;

    const dur = (60 / this.currentTrack.bpm) * 3.8;

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const env = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1100, now);

      env.gain.setValueAtTime(0.0001, now + idx * 0.04);
      env.gain.exponentialRampToValueAtTime(0.14 / chord.length, now + idx * 0.04 + 0.12);
      env.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + dur);

      osc.connect(filter);
      filter.connect(env);
      env.connect(this.masterGain);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + dur + 0.05);
    });
  }

  public dispose() {
    this.stop();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
    }
  }
}

export const cafeAudio = new CafeAudioEngine();
