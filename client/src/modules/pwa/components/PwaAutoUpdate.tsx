import { usePwaUpdate } from '../hooks/usePwaUpdate'
import { usePwaPreloadErrorRecovery } from '../hooks/usePwaPreloadErrorRecovery'
import PwaUpdateBanner from './PwaUpdateBanner'

const PwaAutoUpdate = () => {
  const { needRefresh, isUpdating, applyUpdate, dismiss } = usePwaUpdate()
  usePwaPreloadErrorRecovery()

  return (
    <PwaUpdateBanner
      isVisible={needRefresh}
      isUpdating={isUpdating}
      onUpdate={applyUpdate}
      onDismiss={dismiss}
    />
  )
}

export default PwaAutoUpdate
