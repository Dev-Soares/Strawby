import { Component, type ErrorInfo, type ReactNode } from 'react'
import { errorBootstrap } from './BootstrapDiagnostics'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    errorBootstrap('React ErrorBoundary', `${error.message}\n${info.componentStack ?? ''}`)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 px-6 text-center">
          <h1 className="text-2xl font-black text-neutral-950 dark:text-white mb-3">
            Algo deu errado
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
            Toque no painel de diagnóstico no canto inferior para ver detalhes.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl"
          >
            Tentar novamente
          </button>
          {this.state.error && (
            <pre className="mt-6 text-left text-xs text-neutral-500 max-w-md overflow-auto p-4 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
