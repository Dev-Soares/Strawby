import { motion } from 'framer-motion'

interface UserChatMessageProps {
  content: string
}

export default function UserChatMessage({ content }: UserChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex justify-end"
    >
      <div className="max-w-[85%] rounded-2xl rounded-br-none bg-red-600 px-5 py-3.5 text-[15px] leading-relaxed text-white dark:bg-red-500">
        {content}
      </div>
    </motion.div>
  )
}
