import { AnimatePresence, motion } from 'framer-motion'
import { X, DotsThreeVertical, Export, Plus, Check, ArrowDown, Warning, InstagramLogo } from '@phosphor-icons/react'

type Platform = 'android' | 'ios'

function isInstagramInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('instagram')
}

interface InstallPromptModalProps {
  isOpen: boolean
  onClose: () => void
  platform: Platform
}

function AndroidGuide() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center transition-colors duration-300">
        Seu navegador não mostrou o prompt automático. Siga os passos abaixo para instalar manualmente.
      </p>

      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            1
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Abra o menu do Chrome
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
              Toque nos três pontinhos <DotsThreeVertical size={18} weight="bold" className="inline align-text-bottom text-neutral-800 dark:text-neutral-200 transition-colors duration-300" /> no canto superior direito da tela.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            2
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Procure a opção de instalação
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
              Role o menu para baixo e toque em <strong className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300">&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300">&ldquo;Adicionar à tela inicial&rdquo;</strong>.
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 italic transition-colors duration-300">
              Dica: a opção pode estar perto do final do menu.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            3
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Confirme a instalação
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
              Uma janela aparecerá perguntando se deseja instalar o Strawby. Toque em <strong className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300">&ldquo;Instalar&rdquo;</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-sm font-extrabold shrink-0">
            <Check size={16} weight="bold" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Pronto!
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
              O Strawby vai aparecer na sua tela inicial como um app normal, com notificações e tudo.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Não está vendo a opção?</strong> Certifique-se de que está usando o Chrome (não funciona no navegador anônimo) e que o site foi carregado por alguns segundos. Se mesmo assim não aparecer, adicione manualmente pela tela inicial: toque e segure a tela vazia &rarr; Widgets &rarr; Chrome &rarr; Atalhos.
        </p>
      </div>
    </div>
  )
}

function IosGuide() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center transition-colors duration-300">
        O iOS não mostra um popup automático. Você precisa adicionar manualmente à tela inicial.
      </p>

      {/* Aviso para navegador interno do Instagram */}
      {isInstagramInAppBrowser() && (
        <div className="flex flex-col gap-3">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2">
              <InstagramLogo size={18} weight="duotone" className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 transition-colors duration-300">
                Você está no Instagram
              </span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed transition-colors duration-300">
              Para instalar o Strawby, primeiro toque nos três pontinhos <DotsThreeVertical size={16} weight="bold" className="inline align-text-bottom" /> no canto superior direito e escolha <strong>&ldquo;Abrir no Safari&rdquo;</strong> (ou &ldquo;Abrir no navegador externo&rdquo;).
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-extrabold shrink-0 transition-colors duration-300">
            1
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Toque no botão Compartilhar
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
              Na barra de ferramentas do navegador (geralmente embaixo da tela), toque no ícone <Export size={18} weight="bold" className="inline align-text-bottom text-neutral-800 dark:text-neutral-200 transition-colors duration-300" /> <strong className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300">Compartilhar</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-extrabold shrink-0 transition-colors duration-300">
            2
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Role para baixo na lista
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
              A lista de opções aparecerá. Deslize o dedo para cima <ArrowDown size={18} weight="bold" className="inline align-text-bottom text-neutral-800 dark:text-neutral-200 transition-colors duration-300" /> até encontrar mais opções.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-extrabold shrink-0 transition-colors duration-300">
            3
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Toque em &ldquo;Adicionar à Tela de Início&rdquo;
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
              Procure o ícone <Plus size={18} weight="bold" className="inline align-text-bottom text-neutral-800 dark:text-neutral-200 transition-colors duration-300" /> <strong className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300">&ldquo;Adicionar à Tela de Início&rdquo;</strong> e toque nele.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-extrabold shrink-0 transition-colors duration-300">
            4
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Confirme no canto superior direito
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
              Uma tela de pré-visualização aparecerá. Toque em <strong className="text-neutral-800 dark:text-neutral-200 transition-colors duration-300">&ldquo;Adicionar&rdquo;</strong> no canto superior direito.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-sm font-extrabold shrink-0 transition-colors duration-300">
            <Check size={16} weight="bold" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
              Pronto!
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed transition-colors duration-300">
              O Strawby aparecerá na sua tela inicial como um app nativo, sem barra de endereço do navegador.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-xl p-4 transition-colors duration-300">
        <div className="flex items-start gap-2.5">
          <Warning size={16} weight="bold" className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 transition-colors duration-300" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed transition-colors duration-300">
            <strong>Importante:</strong> PWAs no iOS têm algumas limitações em relação a apps nativos, como armazenamento offline limitado (geralmente até 50 MB) e sem sincronização em segundo plano. Além disso, o Strawby não está disponível na Apple App Store — ele é distribuído diretamente pela web.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function InstallPromptModal({ isOpen, onClose, platform }: InstallPromptModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 bg-white dark:bg-neutral-900 z-10 transition-colors duration-300">
              <h2 className="text-lg font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight transition-colors duration-300">
                {platform === 'android' ? 'Instalar no Android' : 'Instalar no iPhone/iPad'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <X size={15} weight="bold" className="text-neutral-600 dark:text-neutral-300 transition-colors duration-300" />
              </button>
            </div>

            <div className="px-6 pb-8 overflow-y-auto">
              {platform === 'android' ? <AndroidGuide /> : <IosGuide />}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 shrink-0 bg-white dark:bg-neutral-900 transition-colors duration-300">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-neutral-950 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-bold text-white dark:text-neutral-950 transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
