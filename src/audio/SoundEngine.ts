import { gainFor } from '../engine'

/** Makes the browser's audio context, or null if this browser has none. Called only when sound is turned on. */
export type ContextFactory = () => AudioContext | null

const BEEP_HZ = 880
const FLATLINE_HZ = 1000
const NOISE_SECONDS = 2

/**
 * All the game's sound, made with the Web Audio API so there are no files to download or license:
 * rain (filtered noise), a heart-monitor beep and the long flatline tone. Nothing exists until
 * `start()`, which the game only calls once the player has turned sound on and interacted.
 */
export class SoundEngine {
  private createContext: ContextFactory
  private context: AudioContext | null = null
  private master: GainNode | null = null
  private rain: AudioBufferSourceNode | null = null
  private beepTimer: ReturnType<typeof setTimeout> | null = null
  private beepInterval: number | null = null // seconds between beeps; null means no beeping
  private volume = 0.5

  constructor(createContext: ContextFactory) {
    this.createContext = createContext
  }

  get running(): boolean {
    return this.context !== null
  }

  /** Starts the rain. Returns false if the browser cannot make sound. */
  start(): boolean {
    if (this.context) return true
    const context = this.createContext()
    if (!context) return false
    this.context = context
    this.master = context.createGain()
    this.master.gain.value = gainFor(this.volume)
    this.master.connect(context.destination)
    void context.resume()
    this.startRain(context, this.master)
    this.scheduleBeep()
    return true
  }

  /** Silences everything and lets go of the audio device. */
  stop(): void {
    this.clearBeepTimer()
    try {
      this.rain?.stop()
    } catch {
      // Already stopped, which is fine.
    }
    void this.context?.close()
    this.rain = null
    this.master = null
    this.context = null
  }

  setVolume(volume: number): void {
    this.volume = volume
    if (this.master && this.context) this.master.gain.setTargetAtTime(gainFor(volume), this.context.currentTime, 0.05)
  }

  /** Seconds between heart-monitor beeps, or null for none (title, settings, after a run ends). */
  setHeartbeat(interval: number | null): void {
    this.beepInterval = interval
    if (interval === null) this.clearBeepTimer()
    else this.scheduleBeep()
  }

  /** One beep, for feedback when the volume changes. */
  beep(): void {
    this.tone(BEEP_HZ, 0.005, 0, 0.12, 0.35)
  }

  /** The long flat tone of a monitor that has stopped. */
  playFlatline(): void {
    this.clearBeepTimer()
    this.tone(FLATLINE_HZ, 0.02, 2.2, 3.2, 0.3)
  }

  private scheduleBeep(): void {
    if (!this.context || this.beepInterval === null || this.beepTimer !== null) return
    this.beep()
    // The next beat waits for the interval as it is now, so a faster pulse takes effect on the following beat.
    this.beepTimer = setTimeout(() => {
      this.beepTimer = null
      this.scheduleBeep()
    }, this.beepInterval * 1000)
  }

  private clearBeepTimer(): void {
    if (this.beepTimer !== null) clearTimeout(this.beepTimer)
    this.beepTimer = null
  }

  /** A sine tone with a quick attack, an optional steady hold, and a fade to silence. */
  private tone(hz: number, attack: number, hold: number, total: number, peak: number): void {
    if (!this.context || !this.master) return
    const now = this.context.currentTime
    const oscillator = this.context.createOscillator()
    const envelope = this.context.createGain()
    oscillator.frequency.value = hz
    envelope.gain.setValueAtTime(0, now)
    envelope.gain.linearRampToValueAtTime(peak, now + attack)
    envelope.gain.setValueAtTime(peak, now + attack + hold)
    envelope.gain.linearRampToValueAtTime(0, now + total)
    oscillator.connect(envelope)
    envelope.connect(this.master)
    oscillator.start(now)
    oscillator.stop(now + total + 0.05)
  }

  /** Rain is white noise with the rumble and the hiss filtered off, looped. */
  private startRain(context: AudioContext, destination: GainNode): void {
    const length = Math.floor(context.sampleRate * NOISE_SECONDS)
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const samples = buffer.getChannelData(0)
    for (let i = 0; i < length; i += 1) samples[i] = Math.random() * 2 - 1

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const highpass = context.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 700
    const lowpass = context.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 6500
    const level = context.createGain()
    level.gain.value = 0.2

    source.connect(highpass)
    highpass.connect(lowpass)
    lowpass.connect(level)
    level.connect(destination)
    source.start()
    this.rain = source
  }
}
