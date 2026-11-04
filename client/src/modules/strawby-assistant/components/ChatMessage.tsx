import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import type { AssistantMessageRole } from '../types/chat'

interface ChatMessageProps {
  role: AssistantMessageRole
  content?: string
  /** Usado quando a fala tem marcação — senão passe `content`. */
  children?: ReactNode
}

export default function ChatMessage({ role, content, children }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <Bubble variant={isUser ? 'muted' : 'outline'} align={isUser ? 'end' : 'start'}>
        <BubbleContent className="px-5 py-3.5 text-[15px] leading-relaxed">
          {children ?? content}
        </BubbleContent>
      </Bubble>
    </motion.div>
  )
}
