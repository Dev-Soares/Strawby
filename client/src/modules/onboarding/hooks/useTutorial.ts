import { useCallback, useEffect, useRef } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'
import Shepherd, { type Tour } from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'
import { useAuth } from '../../auth/hooks/useAuth'
import { createPatientSteps } from '../config/patientTour'
import { createNutritionistSteps } from '../config/nutritionistTour'

const TUTORIAL_KEY = 'strawby_show_tutorial'

const STYLE_ID = 'strawby-tour-styles'

function injectStyles(isDark: boolean) {
  document.getElementById(STYLE_ID)?.remove()

  const bg = isDark ? '#171717' : '#ffffff'
  const border = isDark ? '#262626' : '#f0f0f0'
  const shadow = isDark
    ? '0 24px 48px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)'
    : '0 24px 48px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.025)'
  const titleColor = isDark ? '#f5f5f5' : '#0a0a0a'
  const textColor = isDark ? '#737373' : '#6b7280'
  const progressColor = isDark ? '#525252' : '#a3a3a3'
  const prevBg = isDark ? '#262626' : '#f5f5f5'
  const prevBgHover = isDark ? '#3a3a3a' : '#e5e5e5'
  const prevColor = isDark ? '#a3a3a3' : '#6b7280'
  const cancelColor = isDark ? '#525252' : '#a3a3a3'
  const cancelHoverBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    .shepherd-element {
      background: ${bg} !important;
      border: 1px solid ${border} !important;
      border-radius: 1.25rem !important;
      box-shadow: ${shadow} !important;
      max-width: 340px !important;
      min-width: 280px !important;
      font-family: 'Satoshi', system-ui, sans-serif !important;
      outline: none !important;
      z-index: 9999 !important;
    }
    .shepherd-content {
      border-radius: 1.25rem !important;
    }
    .shepherd-header {
      background: transparent !important;
      padding: 1.375rem 1.375rem 0 !important;
      display: flex !important;
      align-items: flex-start !important;
      gap: 0.625rem !important;
    }
    .shepherd-title {
      display: block !important;
      color: ${titleColor} !important;
      font-size: 1.0625rem !important;
      font-weight: 800 !important;
      letter-spacing: -0.025em !important;
      line-height: 1.3 !important;
      font-family: 'Cabinet Grotesk', 'Satoshi', system-ui, sans-serif !important;
      flex: 1 1 auto !important;
      margin: 0 !important;
    }
    .shepherd-step-progress {
      display: block !important;
      font-size: 0.6875rem !important;
      font-weight: 700 !important;
      color: ${progressColor} !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      margin-bottom: 0.3rem !important;
      font-family: 'Satoshi', system-ui, sans-serif !important;
      line-height: 1 !important;
    }
    .shepherd-text {
      color: ${textColor} !important;
      font-size: 0.875rem !important;
      line-height: 1.65 !important;
      font-weight: 500 !important;
      padding: 0.5rem 1.375rem 0 !important;
      font-family: 'Satoshi', system-ui, sans-serif !important;
    }
    .shepherd-footer {
      padding: 1.25rem 1.375rem 1.375rem !important;
      background: transparent !important;
      display: flex !important;
      justify-content: flex-end !important;
      gap: 0.5rem !important;
    }
    .shepherd-element .shepherd-footer .shepherd-button {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 0.75rem !important;
      font-weight: 700 !important;
      font-size: 0.875rem !important;
      padding: 0.625rem 1.375rem !important;
      min-height: 2.5rem !important;
      transition: background-color 0.15s ease !important;
      cursor: pointer !important;
      outline: none !important;
      white-space: nowrap !important;
      line-height: 1 !important;
      border: none !important;
    }
    .shepherd-element .shepherd-footer .shepherd-button.shepherd-btn-next {
      background-color: #dc2626 !important;
      color: #ffffff !important;
    }
    .shepherd-element .shepherd-footer .shepherd-button.shepherd-btn-next:hover {
      background-color: #b91c1c !important;
    }
    .shepherd-element .shepherd-footer .shepherd-button.shepherd-btn-prev {
      background-color: ${prevBg} !important;
      color: ${prevColor} !important;
      border: 1px solid ${border} !important;
    }
    .shepherd-element .shepherd-footer .shepherd-button.shepherd-btn-prev:hover {
      background-color: ${prevBgHover} !important;
    }
    .shepherd-cancel-icon {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 1.75rem !important;
      height: 1.75rem !important;
      flex-shrink: 0 !important;
      color: ${cancelColor} !important;
      background: transparent !important;
      border: none !important;
      cursor: pointer !important;
      border-radius: 0.5rem !important;
      transition: all 0.15s ease !important;
      padding: 0 !important;
      font-size: 1.375rem !important;
      line-height: 1 !important;
      margin-top: -0.125rem !important;
    }
    .shepherd-cancel-icon:hover {
      background: ${cancelHoverBg} !important;
      color: ${isDark ? '#a3a3a3' : '#525252'} !important;
    }
    .shepherd-cancel-icon span {
      font-size: inherit !important;
      line-height: 1 !important;
    }
    .shepherd-arrow::before {
      background-color: ${bg} !important;
      border-color: ${border} !important;
    }
    .shepherd-modal-overlay-container {
      fill: ${isDark ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.6)'} !important;
    }
  `
  document.head.appendChild(style)
}

function removeStyles() {
  document.getElementById(STYLE_ID)?.remove()
}

function buildTour(
  navigate: NavigateFunction,
  role: 'patient' | 'nutritionist',
): Tour {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    exitOnEsc: true,
    keyboardNavigation: false,
    defaultStepOptions: {
      cancelIcon: { enabled: true },
      scrollTo: { behavior: 'smooth', block: 'center' },
      modalOverlayOpeningRadius: 12,
      modalOverlayOpeningPadding: 8,
    },
  })

  const proxy = {
    next: () => tour.next(),
    back: () => tour.back(),
    complete: () => tour.complete(),
  }

  const steps =
    role === 'nutritionist'
      ? createNutritionistSteps(proxy, navigate)
      : createPatientSteps(proxy, navigate)

  tour.addSteps(steps)

  tour.on('complete', () => {
    navigate('/app/home')
    removeStyles()
  })

  tour.on('cancel', removeStyles)

  return tour
}

export function useAutoTutorial() {
  const triggerTutorial = useTriggerTutorial()
  const triggerRef = useRef(triggerTutorial)
  triggerRef.current = triggerTutorial

  useEffect(() => {
    if (!sessionStorage.getItem(TUTORIAL_KEY)) return

    sessionStorage.removeItem(TUTORIAL_KEY)
    let fired = false

    const timer = setTimeout(() => {
      fired = true
      triggerRef.current()
    }, 1000)

    return () => {
      clearTimeout(timer)
      if (!fired) sessionStorage.setItem(TUTORIAL_KEY, '1')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

export function useTriggerTutorial() {
  const navigate = useNavigate()
  const { data: user } = useAuth()

  return useCallback(() => {
    if (!user || user.role === 'user') return
    const isDark = document.documentElement.classList.contains('dark')
    injectStyles(isDark)
    const tour = buildTour(navigate, user.role)
    tour.start()
  }, [navigate, user])
}
