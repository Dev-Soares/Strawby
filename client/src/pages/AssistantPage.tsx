import { Suspense } from 'react'
import AppLayout from '../shared/layouts/AppLayout'
import AssistantChatSkeleton from '../modules/strawby-assistant/skeletons/AssistantChatSkeleton'
import ChatContainer from '../modules/strawby-assistant/components/ChatContainer'

export default function AssistantPage() {
  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 xl:px-24 pt-6 pb-6 sm:pt-8">
        <div className="h-[calc(100dvh-13rem)] sm:h-[calc(100dvh-16rem)]">
          <Suspense fallback={<AssistantChatSkeleton />}>
            <ChatContainer />
          </Suspense>
        </div>
      </div>
    </AppLayout>
  )
}
