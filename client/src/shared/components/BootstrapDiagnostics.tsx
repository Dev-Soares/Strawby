import { useEffect, useState } from 'react'

interface LogEntry {
  id: number
  type: 'info' | 'warn' | 'error'
  message: string
  detail?: string
}

let logId = 0

function addLog(type: LogEntry['type'], message: string, detail?: string) {
  const entry: LogEntry = { id: ++logId, type, message, detail }
  listeners.forEach((cb) => cb(entry))
}

const listeners = new Set<(entry: LogEntry) => void>()

export function logBootstrap(message: string, detail?: string) {
  addLog('info', message, detail)
}

export function warnBootstrap(message: string, detail?: string) {
  addLog('warn', message, detail)
}

export function errorBootstrap(message: string, detail?: string) {
  addLog('error', message, detail)
}

export function installGlobalErrorHandlers() {
  const originalOnError = window.onerror
  window.onerror = (message, source, lineno, colno, error) => {
    errorBootstrap(
      'window.onerror',
      `${message} @ ${source ?? '?'}:${lineno ?? '?'}:${colno ?? '?'} ${error?.stack ?? error ?? ''}`,
    )
    if (typeof originalOnError === 'function') {
      return originalOnError(message, source, lineno, colno, error)
    }
    return false
  }

  window.addEventListener('unhandledrejection', (event) => {
    errorBootstrap(
      'unhandledrejection',
      event.reason instanceof Error ? event.reason.stack ?? event.reason.message : String(event.reason),
    )
  })
}

export default function BootstrapDiagnostics() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const handler = (entry: LogEntry) => {
      setLogs((prev) => [...prev, entry])
    }
    listeners.add(handler)
    logBootstrap('Diagnostics montado', navigator.userAgent.slice(0, 120))
    return () => {
      listeners.delete(handler)
    }
  }, [])

  if (logs.length === 0) return null

  const errors = logs.filter((l) => l.type === 'error').length

  return (
    <div
      className={`fixed left-3 right-3 bottom-3 z-[9999] rounded-xl border border-red-200 bg-white/95 text-neutral-900 shadow-xl backdrop-blur ${expanded ? 'max-h-[60vh]' : 'max-h-14'} overflow-hidden transition-all duration-200`}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center justify-between px-3 py-3">
        <span className="text-xs font-bold text-red-600">
          {errors > 0 ? `${errors} erro(s)` : 'Diagnóstico'}
        </span>
        <span className="text-[10px] text-neutral-500">
          {expanded ? 'Toque para fechar' : 'Toque para expandir'}
        </span>
      </div>
      {expanded && (
        <div className="border-t border-neutral-200 px-3 py-2 space-y-2 overflow-y-auto max-h-[calc(60vh-3rem)] text-[11px] font-mono">
          {logs.map((log) => (
            <div key={log.id}>
              <span
                className={`font-bold ${
                  log.type === 'error' ? 'text-red-600' : log.type === 'warn' ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {log.type.toUpperCase()}
              </span>
              <span className="text-neutral-700 ml-1">{log.message}</span>
              {log.detail && <div className="text-neutral-500 break-words mt-0.5">{log.detail}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
