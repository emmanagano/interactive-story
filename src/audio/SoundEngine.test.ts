import { afterEach, describe, expect, it, vi } from 'vitest'
import { SoundEngine } from './SoundEngine'

// A stand-in for the browser's audio, recording what the engine asks it to make.
function makeFakeAudio() {
  const log = { oscillators: [] as { hz: number; started: boolean }[], contextsMade: 0, closed: 0, rainStarted: 0, rainStopped: 0, masterGain: [] as number[] }
  const param = () => ({
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(function (this: { value: number }, value: number) {
      log.masterGain.push(value)
    }),
  })
  const node = () => ({ connect: vi.fn(), disconnect: vi.fn() })
  const context = {
    currentTime: 0,
    sampleRate: 8000,
    destination: {},
    resume: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => {
      log.closed += 1
      return Promise.resolve()
    }),
    createGain: () => ({ ...node(), gain: param() }),
    createOscillator: () => {
      const record = { hz: 0, started: false }
      log.oscillators.push(record)
      return {
        ...node(),
        frequency: {
          set value(hz: number) {
            record.hz = hz
          },
        },
        start: () => {
          record.started = true
        },
        stop: vi.fn(),
      }
    },
    createBuffer: (_channels: number, length: number) => ({ getChannelData: () => new Float32Array(length) }),
    createBufferSource: () => ({
      ...node(),
      buffer: null,
      loop: false,
      start: () => {
        log.rainStarted += 1
      },
      stop: () => {
        log.rainStopped += 1
      },
    }),
    createBiquadFilter: () => ({ ...node(), type: '', frequency: { value: 0 } }),
  }
  const factory = vi.fn(() => {
    log.contextsMade += 1
    return context as unknown as AudioContext
  })
  return { log, factory }
}

afterEach(() => vi.useRealTimers())

describe('SoundEngine', () => {
  it('makes no audio at all until it is started', () => {
    const { factory, log } = makeFakeAudio()
    const engine = new SoundEngine(factory)
    engine.setVolume(0.8)
    engine.setHeartbeat(0.5)
    engine.playFlatline()
    engine.beep()
    expect(factory).not.toHaveBeenCalled()
    expect(log.oscillators).toHaveLength(0)
    expect(engine.running).toBe(false)
  })

  it('starts the rain and a beep when started with a heartbeat set', () => {
    const { factory, log } = makeFakeAudio()
    const engine = new SoundEngine(factory)
    engine.setHeartbeat(1)
    expect(engine.start()).toBe(true)
    expect(log.rainStarted).toBe(1)
    expect(log.oscillators.map((oscillator) => oscillator.hz)).toEqual([880])
    expect(engine.start()).toBe(true) // starting twice does not make a second context
    expect(log.contextsMade).toBe(1)
  })

  it('beeps at the heartbeat interval and speeds up when it changes', () => {
    vi.useFakeTimers()
    const { factory, log } = makeFakeAudio()
    const engine = new SoundEngine(factory)
    engine.start()
    engine.setHeartbeat(1)
    expect(log.oscillators).toHaveLength(1)
    vi.advanceTimersByTime(1000)
    expect(log.oscillators).toHaveLength(2)
    engine.setHeartbeat(0.25)
    vi.advanceTimersByTime(1000) // the next beat is still on the old interval...
    expect(log.oscillators.length).toBeGreaterThanOrEqual(3)
    const before = log.oscillators.length
    vi.advanceTimersByTime(1000) // ...then they come four to a second
    expect(log.oscillators.length - before).toBeGreaterThanOrEqual(4)
  })

  it('stops beeping when the heartbeat is cleared', () => {
    vi.useFakeTimers()
    const { factory, log } = makeFakeAudio()
    const engine = new SoundEngine(factory)
    engine.start()
    engine.setHeartbeat(0.5)
    engine.setHeartbeat(null)
    const count = log.oscillators.length
    vi.advanceTimersByTime(5000)
    expect(log.oscillators).toHaveLength(count)
  })

  it('plays the long flatline tone and silences the beeping', () => {
    vi.useFakeTimers()
    const { factory, log } = makeFakeAudio()
    const engine = new SoundEngine(factory)
    engine.start()
    engine.setHeartbeat(0.5)
    engine.playFlatline()
    const afterTone = log.oscillators.length
    expect(log.oscillators[afterTone - 1].hz).toBe(1000)
    vi.advanceTimersByTime(5000)
    expect(log.oscillators).toHaveLength(afterTone)
  })

  it('stops everything and releases the audio device', () => {
    vi.useFakeTimers()
    const { factory, log } = makeFakeAudio()
    const engine = new SoundEngine(factory)
    engine.start()
    engine.setHeartbeat(0.5)
    engine.stop()
    expect(log.rainStopped).toBe(1)
    expect(log.closed).toBe(1)
    expect(engine.running).toBe(false)
    const count = log.oscillators.length
    vi.advanceTimersByTime(5000)
    expect(log.oscillators).toHaveLength(count)
    engine.playFlatline() // does nothing once stopped
    expect(log.oscillators).toHaveLength(count)
  })

  it('can be started again after it was stopped', () => {
    const { factory, log } = makeFakeAudio()
    const engine = new SoundEngine(factory)
    engine.start()
    engine.stop()
    engine.start()
    expect(log.contextsMade).toBe(2)
  })

  it('follows the volume while running', () => {
    const { factory, log } = makeFakeAudio()
    const engine = new SoundEngine(factory)
    engine.start()
    engine.setVolume(1)
    engine.setVolume(0)
    expect(log.masterGain).toEqual([expect.any(Number), 0])
    expect(log.masterGain[0]).toBeGreaterThan(0)
  })

  it('reports it cannot make sound, without throwing, when the browser has no audio', () => {
    const engine = new SoundEngine(() => null)
    expect(engine.start()).toBe(false)
    expect(engine.running).toBe(false)
    expect(() => engine.setHeartbeat(1)).not.toThrow()
  })
})
