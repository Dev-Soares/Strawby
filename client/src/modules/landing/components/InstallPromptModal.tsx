import { AnimatePresence, motion } from 'framer-motion'
import { X, DotsThreeVertical, Export, Plus, Check, ArrowDown } from '@phosphor-icons/react'

type Platform = 'android' | 'ios'

interface InstallPromptModalProps {
  isOpen: boolean
  onClose: () => void
  platform: Platform
}

function AndroidGuide() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-neutral-500 text-center">
        Seu navegador não mostrou o prompt automático. Siga os passos abaixo para instalar manualmente.
      </p>

      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            1
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900">
              Abra o menu do Chrome
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Toque nos três pontinhos <DotsThreeVertical size={18} weight="bold" className="inline align-text-bottom text-neutral-800" /> no canto superior direito da tela.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            2
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900">
              Procure a opção de instalação
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Role o menu para baixo e toque em <strong className="text-neutral-800">&ldquo;Instalar aplicativo&rdquo;</strong> ou <strong className="text-neutral-800">&ldquo;Adicionar à tela inicial&rdquo;</strong>.
            </p>
            <p className="text-xs text-neutral-500 italic">
              Dica: a opção pode estar perto do final do menu.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            3
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900">
              Confirme a instalação
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Uma janela aparecerá perguntando se deseja instalar o Strawby. Toque em <strong className="text-neutral-800">&ldquo;Instalar&rdquo;</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-sm font-extrabold shrink-0">
            <Check size={16} weight="bold" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900">
              Pronto!
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
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
      <p className="text-sm text-neutral-500 text-center">
        No iPhone/iPad, a instalação é feita pelo Safari. Siga os passos abaixo.
      </p>

      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            1
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900">
              Toque no botão Compartilhar
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Na barra de ferramentas do Safari (embaixo da tela), toque no ícone <Export size={18} weight="bold" className="inline align-text-bottom text-neutral-800" /> <strong className="text-neutral-800">Compartilhar</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            2
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900">
              Role para baixo na lista
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              A lista de opções aparecerá. Deslize o dedo para cima <ArrowDown size={18} weight="bold" className="inline align-text-bottom text-neutral-800" /> até encontrar mais opções.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            3
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900">
              Toque em &ldquo;Adicionar à Tela de Início&rdquo;
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Procure o ícone <Plus size={18} weight="bold" className="inline align-text-bottom text-neutral-800" /> <strong className="text-neutral-800">&ldquo;Adicionar à Tela de Início&rdquo;</strong> e toque nele.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0">
            4
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900">
              Confirme no canto superior direito
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Uma tela de pré-visualização aparecerá. Toque em <strong className="text-neutral-800">&ldquo;Adicionar&rdquo;</strong> no canto superior direito.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-sm font-extrabold shrink-0">
            <Check size={16} weight="bold" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900">
              Pronto!
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed">
              O Strawby aparecerá na sua tela inicial como um app nativo, sem barra de endereço do Safari.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Importante:</strong> Isso só funciona no Safari. Chrome ou outros navegadores no iOS não permitem adicionar à tela inicial com ícone próprio. Se estiver em outro navegador, abra o link no Safari primeiro.
        </p>
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
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.24, ease: [0.34, 1.05, 0.64, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 bg-white z-10">
              <h2 className="text-lg font-extrabold text-neutral-950 tracking-tight">
                {platform === 'android' ? 'Instalar no Android' : 'Instalar no iPhone/iPad'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <X size={15} weight="bold" className="text-neutral-600" />
              </button>
            </div>

            <div className="px-6 pb-8 overflow-y-auto">
              {platform === 'android' ? <AndroidGuide /> : <IosGuide />}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 shrink-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-sm font-bold text-white transition-colors cursor-pointer"
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
