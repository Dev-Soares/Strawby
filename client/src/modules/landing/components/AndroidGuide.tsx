import { DotsThreeVertical, Check } from '@phosphor-icons/react'

export default function AndroidGuide() {
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
