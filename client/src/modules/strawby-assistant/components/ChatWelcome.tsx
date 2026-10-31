export default function ChatWelcome() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 py-4 sm:py-8 text-center">
      <img
        src="/mascot/mascot-smile.webp"
        alt=""
        className="h-32 w-32 sm:h-36 sm:w-36 object-contain drop-shadow-lg"
      />

      <div className="space-y-1 sm:space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-neutral-100">
          Assistente Strawby
        </h2>
        <p className="max-w-xs mx-auto text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
          Diga o que você quer comer, suas metas ou o que tem na geladeira. O moranguinho monta refeições para você.
        </p>
      </div>
    </div>
  )
}
