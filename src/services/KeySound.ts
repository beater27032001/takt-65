import { soundRecipe, type Sound, type SwitchId } from '@domain/keyboard'

/** Síntese do som das teclas com Web Audio: ruído filtrado + tom curto, sem arquivos de áudio. */
export class KeySound {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null

  /** Cria o contexto no primeiro toque (o navegador só libera áudio depois de um gesto). */
  private ready() {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Ctx) return null
      this.ctx = new Ctx()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.8
      this.master.connect(this.ctx.destination)
      this.noise = this.ctx.createBuffer(
        1,
        this.ctx.sampleRate * 0.25,
        this.ctx.sampleRate,
      )
      const data = this.noise.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  private play(sound: Sound, start: number) {
    const ctx = this.ctx!
    const t = start + sound.at
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(sound.gain, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + sound.length)
    gain.connect(this.master!)
    if (sound.kind === 'noise') {
      const src = ctx.createBufferSource()
      src.buffer = this.noise
      const filter = ctx.createBiquadFilter()
      filter.type = sound.filter
      filter.frequency.value = sound.freq
      filter.Q.value = sound.q
      src.connect(filter).connect(gain)
      src.start(t, Math.random() * 0.1)
      src.stop(t + sound.length + 0.02)
    } else {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(sound.freq, t)
      osc.frequency.exponentialRampToValueAtTime(
        sound.freq * 0.55,
        t + sound.length,
      )
      osc.connect(gain)
      osc.start(t)
      osc.stop(t + sound.length + 0.02)
    }
  }

  /** Toca o som de uma tecla descendo ou subindo, `delay` segundos à frente. */
  stroke(id: SwitchId, down: boolean, big = false, delay = 0) {
    const ctx = this.ready()
    if (!ctx) return
    const start = ctx.currentTime + delay + 0.005
    const variation = 0.92 + Math.random() * 0.16
    for (const sound of soundRecipe(id, down, big, variation))
      this.play(sound, start)
  }
}
