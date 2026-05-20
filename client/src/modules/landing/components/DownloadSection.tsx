import { useState } from 'react'
import { motion } from 'framer-motion'
import { AndroidLogo, AppleLogo, Globe } from '@phosphor-icons/react'
import { useAndroidInstall } from '@/shared/hooks/useAndroidInstall'
import { useIosInstall } from '@/shared/hooks/useIosInstall'
import InstallPromptModal from './InstallPromptModal'

type Platform = 'android' | 'ios'

export default function DownloadSection() {
  const { isInstallable, promptInstall, shouldShowGuide: androidNeedsGuide } = useAndroidInstall()
  const { isIos } = useIosInstall()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPlatform, setModalPlatform] = useState<Platform>('android')

  const openModal = (platform: Platform) => {
    setModalPlatform(platform)
    setModalOpen(true)
  }

  const handleAndroid = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (isInstallable) {
      void promptInstall()
      return
    }
    openModal('android')
  }

  const handleIos = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    openModal('ios')
  }

  return (
    <>
      <section className="relative bg-stone-50 py-20 lg:py-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <motion.h2
            className="font-display text-[32px] sm:text-[44px] lg:text-[56px] font-black tracking-[-0.04em] text-neutral-950 leading-[0.92] mb-5"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.34, 1.05, 0.64, 1] }}
          >
            Leve o Strawby<br />
            <span className="text-red-600">com voc&ecirc;.</span>
          </motion.h2>

          <motion.p
            className="text-neutral-600 text-[17px] sm:text-[19px] leading-relaxed mb-12 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          >
            Instale o app no seu celular ou use direto no navegador. Funciona em qualquer dispositivo.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.2 }}
          >
            <a
              href="/app/create-account"
              onClick={handleAndroid}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-white hover:bg-red-50 border border-neutral-200 hover:border-red-200 text-neutral-900 font-bold px-7 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-[15px] cursor-pointer"
            >
              <AndroidLogo size={22} weight="duotone" className="text-red-600" />
              <span>Baixar no Android</span>
            </a>

            <a
              href="/app/create-account"
              onClick={handleIos}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-white hover:bg-red-50 border border-neutral-200 hover:border-red-200 text-neutral-900 font-bold px-7 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-[15px] cursor-pointer"
            >
              <AppleLogo size={22} weight="duotone" className="text-red-600" />
              <span>Baixar no iOS</span>
            </a>

            <a
              href="/app/create-account"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-white hover:bg-red-50 border border-neutral-200 hover:border-red-200 text-neutral-900 font-bold px-7 py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md text-[15px] cursor-pointer"
            >
              <Globe size={22} weight="duotone" className="text-red-600" />
              <span>Usar no navegador</span>
            </a>
          </motion.div>
        </div>
      </section>

      <InstallPromptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        platform={modalPlatform}
      />
    </>
  )
}
