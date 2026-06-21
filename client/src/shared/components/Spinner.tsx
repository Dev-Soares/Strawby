interface SpinnerProps {
  size?: number
  className?: string
}

export default function Spinner({ size = 16, className = 'border-white/30 border-t-white' }: SpinnerProps) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full border-2 animate-spin ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
