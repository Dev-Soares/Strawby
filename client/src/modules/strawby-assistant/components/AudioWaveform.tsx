import { motion } from 'framer-motion'

interface AudioWaveformProps {
  bars: number[]
}

export default function AudioWaveform({ bars }: AudioWaveformProps) {
  return (
    <div className="flex h-7 items-end gap-[5px] pb-0.5">
      {bars.map((scale, index) => (
        <motion.div
          key={index}
          className="h-7 w-[5px] origin-bottom rounded-full bg-red-600"
          animate={{ scaleY: scale }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      ))}
    </div>
  )
}
