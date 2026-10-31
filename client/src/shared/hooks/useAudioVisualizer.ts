import { useCallback, useEffect, useRef, useState } from 'react'

export const useAudioVisualizer = (barCount = 12) => {
  const [bars, setBars] = useState<number[]>(() => Array(barCount).fill(0.1))
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const updateRef = useRef<() => void>(() => {})

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    sourceRef.current?.disconnect()
    analyserRef.current?.disconnect()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    void audioContextRef.current?.close()
    audioContextRef.current = null
    analyserRef.current = null
    sourceRef.current = null
    streamRef.current = null
    setBars(Array(barCount).fill(0.1))
  }, [barCount])

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 64
      analyser.smoothingTimeConstant = 0.8

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser
      sourceRef.current = source

      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      const step = Math.floor(dataArray.length / barCount)

      updateRef.current = () => {
        if (!analyserRef.current) return
        analyserRef.current.getByteFrequencyData(dataArray)
        const newBars = Array.from({ length: barCount }, (_, index) => {
          const value = dataArray[index * step] ?? 0
          return Math.max(0.08, value / 255)
        })
        setBars(newBars)
        rafRef.current = requestAnimationFrame(updateRef.current)
      }

      rafRef.current = requestAnimationFrame(updateRef.current)
    } catch {
      setBars(Array(barCount).fill(0.1))
    }
  }, [barCount])

  useEffect(() => {
    return () => stop()
  }, [stop])

  return { bars, start, stop }
}
