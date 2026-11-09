import { ArrowDown, Check, EllipsisVertical, Plus, Share, TriangleAlert } from 'lucide-react'
import { InstagramLogo } from '@phosphor-icons/react'
import { isInstagramInAppBrowser } from '@/shared/utils/browser'

export default function IosGuide() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-neutral-500 text-center transition-colors duration-300">
        O iOS não mostra um popup automático. Você precisa adicionar manualmente à tela inicial.
      </p>

      {/* Aviso para navegador interno do Instagram */}
      {isInstagramInAppBrowser() && (
        <div className="flex flex-col gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2">
              <InstagramLogo size={18} className="text-amber-600 shrink-0" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 transition-colors duration-300">
                Você está no Instagram
              </span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed transition-colors duration-300">
              Para instalar o Strawby, primeiro toque nos três pontinhos <EllipsisVertical size={16} className="inline align-text-bottom" /> no canto superior direito e escolha <strong>&ldquo;Abrir no Safari&rdquo;</strong> (ou &ldquo;Abrir no navegador externo&rdquo;).
            </p>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0 transition-colors duration-300">
            1
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 transition-colors duration-300">
              Toque no botão Compartilhar
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed transition-colors duration-300">
              Na barra de ferramentas do navegador (geralmente embaixo da tela), toque no ícone <Share size={18} className="inline align-text-bottom text-neutral-800 transition-colors duration-300" /> <strong className="text-neutral-800 transition-colors duration-300">Compartilhar</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0 transition-colors duration-300">
            2
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 transition-colors duration-300">
              Role para baixo na lista
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed transition-colors duration-300">
              A lista de opções aparecerá. Deslize o dedo para cima <ArrowDown size={18} className="inline align-text-bottom text-neutral-800 transition-colors duration-300" /> até encontrar mais opções.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0 transition-colors duration-300">
            3
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 transition-colors duration-300">
              Toque em &ldquo;Adicionar à Tela de Início&rdquo;
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed transition-colors duration-300">
              Procure o ícone <Plus size={18} className="inline align-text-bottom text-neutral-800 transition-colors duration-300" /> <strong className="text-neutral-800 transition-colors duration-300">&ldquo;Adicionar à Tela de Início&rdquo;</strong> e toque nele.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 text-sm font-extrabold shrink-0 transition-colors duration-300">
            4
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 transition-colors duration-300">
              Confirme no canto superior direito
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed transition-colors duration-300">
              Uma tela de pré-visualização aparecerá. Toque em <strong className="text-neutral-800 transition-colors duration-300">&ldquo;Adicionar&rdquo;</strong> no canto superior direito.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 text-sm font-extrabold shrink-0 transition-colors duration-300">
            <Check size={16} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-900 transition-colors duration-300">
              Pronto!
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed transition-colors duration-300">
              O Strawby aparecerá na sua tela inicial como um app nativo, sem barra de endereço do navegador.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 transition-colors duration-300">
        <div className="flex items-start gap-2.5">
          <TriangleAlert size={16} className="text-amber-600 shrink-0 mt-0.5 transition-colors duration-300" />
          <p className="text-xs text-amber-800 leading-relaxed transition-colors duration-300">
            <strong>Importante:</strong> PWAs no iOS têm algumas limitações em relação a apps nativos, como armazenamento offline limitado (geralmente até 50 MB) e sem sincronização em segundo plano. Além disso, o Strawby não está disponível na Apple App Store — ele é distribuído diretamente pela web.
          </p>
        </div>
      </div>
    </div>
  )
}
