import { useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from '../utils/constants'

// ── Probe functions ───────────────────────────────────────────
// GET requests must not send Content-Type — triggers CORS preflight which silently drops the request
async function probeEndpoint(method, path, body) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const opts = { method, signal: controller.signal }
    if (body) {
      opts.headers = { 'Content-Type': 'application/json' }
      opts.body = JSON.stringify(body)
    }
    const res = await fetch(`${API_BASE_URL}${path}`, opts)
    clearTimeout(timer)
    return res.status !== 404
  } catch {
    return null
  }
}

async function probeExport(importFn, exportName) {
  try {
    const mod = await importFn()
    return exportName in mod
  } catch {
    return false
  }
}

async function probeTestFile(importFn) {
  try {
    await importFn()
    return true
  } catch {
    return false
  }
}

// ── Check definitions ─────────────────────────────────────────
const CHECK_GROUPS = [
  {
    person: 'IAN KINOTI — Foundation',
    role:   'Backend + Shared UI',
    color:  'aegean',
    checks: [
      { label: 'Backend server running',        type: 'backend', method: 'GET',  path: '/health' },
      { label: 'Auth router  /auth/login',      type: 'backend', method: 'POST', path: '/auth/login', body: {} },
      { label: 'Admin router  /admin/users',    type: 'backend', method: 'GET',  path: '/admin/users' },
      { label: 'Patients router  /patients',    type: 'backend', method: 'GET',  path: '/patients' },
      { label: 'Lab router  /lab/upload',       type: 'backend', method: 'POST', path: '/lab/upload' },
      { label: 'CSS design system',             type: 'static',  value: true },
      { label: 'Shared  Sidebar',               type: 'export',  importFn: () => import('../components/shared/Sidebar.jsx'),       exportName: 'Sidebar' },
      { label: 'Shared  StatusBadge',           type: 'export',  importFn: () => import('../components/shared/StatusBadge.jsx'),   exportName: 'StatusBadge' },
      { label: 'Shared  RoleBadge',             type: 'export',  importFn: () => import('../components/shared/RoleBadge.jsx'),     exportName: 'RoleBadge' },
      { label: 'AuthContext + hooks',           type: 'export',  importFn: () => import('../context/AuthContext.jsx'),              exportName: 'AuthProvider' },
      { label: 'API client  api.js',            type: 'export',  importFn: () => import('../services/api.js'),                     exportName: 'default' },
      { label: 'Constants  ROLES + ROUTES',     type: 'export',  importFn: () => import('../utils/constants.js'),                  exportName: 'ROLES' },
      { label: 'Admin  AdminPanel',             type: 'export',  importFn: () => import('../components/admin/AdminPanel.jsx'),     exportName: 'AdminPanel' },
      { label: 'Admin  StaffTable',             type: 'export',  importFn: () => import('../components/admin/StaffTable.jsx'),     exportName: 'StaffTable' },
    ],
  },
  {
    person: 'ERIKA GWIYO — Patient Directory + Records',
    role:   'Dashboard + Patient Detail',
    color:  'teal',
    checks: [
      { label: 'Dashboard  StatCard',          type: 'export', importFn: () => import('../components/dashboard/index.jsx'), exportName: 'StatCard' },
      { label: 'Dashboard  PatientTable',      type: 'export', importFn: () => import('../components/dashboard/index.jsx'), exportName: 'PatientTable' },
      { label: 'Dashboard  SearchBar',         type: 'export', importFn: () => import('../components/dashboard/index.jsx'), exportName: 'SearchBar' },
      { label: 'Dashboard  Pagination',        type: 'export', importFn: () => import('../components/dashboard/index.jsx'), exportName: 'Pagination' },
      { label: 'Patient  PatientHeader',       type: 'export', importFn: () => import('../components/patient/index.jsx'),   exportName: 'PatientHeader' },
      { label: 'Patient  MedicalHistoryTab',   type: 'export', importFn: () => import('../components/patient/index.jsx'),   exportName: 'MedicalHistoryTab' },
      { label: 'Patient  CurrentTreatmentTab', type: 'export', importFn: () => import('../components/patient/index.jsx'),   exportName: 'CurrentTreatmentTab' },
      { label: 'Patient  LabReportsTab',       type: 'export', importFn: () => import('../components/patient/index.jsx'),   exportName: 'LabReportsTab' },
      { label: 'Patient  AddDiagnosisForm',    type: 'export', importFn: () => import('../components/patient/index.jsx'),   exportName: 'AddDiagnosisForm' },
    ],
  },
  {
    person: 'JANE NYASORO — Lab Portal',
    role:   'Upload + Patient Lookup',
    color:  'amber',
    checks: [
      { label: 'Lab  FileDropzone',    type: 'export', importFn: () => import('../components/lab/index.jsx'), exportName: 'FileDropzone' },
      { label: 'Lab  PatientIdLookup', type: 'export', importFn: () => import('../components/lab/index.jsx'), exportName: 'PatientIdLookup' },
      { label: 'Lab  UploadForm',      type: 'export', importFn: () => import('../components/lab/index.jsx'), exportName: 'UploadForm' },
    ],
  },
  {
    person: 'JASON MUMO — Testing + QA',
    role:   'Tests + Consistency',
    color:  'coral',
    checks: [
      { label: 'Auth  LoginForm tests',      type: 'test', importFn: () => import('../tests/auth/LoginForm.test.jsx') },
      { label: 'Auth  ProtectedRoute tests', type: 'test', importFn: () => import('../tests/auth/ProtectedRoute.test.jsx') },
      { label: 'Admin  AdminPanel tests',    type: 'test', importFn: () => import('../tests/admin/AdminPanel.test.jsx') },
      { label: 'Dashboard tests',            type: 'test', importFn: () => import('../tests/dashboard/Dashboard.test.jsx') },
      { label: 'Patient detail tests',       type: 'test', importFn: () => import('../tests/patient/PatientDetail.test.jsx') },
      { label: 'Lab portal tests',           type: 'test', importFn: () => import('../tests/lab/LabPortal.test.jsx') },
    ],
  },
]

// ── Theme tokens ──────────────────────────────────────────────
// Preference is persisted to localStorage under the key 'hrms_theme'
const THEMES = {
  dark: {
    pageBg: (mx, my) => `
      radial-gradient(ellipse 70% 55% at ${mx}% ${my}%, rgba(52,152,219,0.10) 0%, transparent 65%),
      radial-gradient(ellipse 100% 80% at 20% 0%, rgba(15,76,117,0.35) 0%, transparent 55%),
      radial-gradient(ellipse 80% 60% at 80% 100%, rgba(26,188,156,0.07) 0%, transparent 55%),
      #060E1C
    `,
    cardBg:          'rgba(10,28,55,0.55)',
    cardBorder:      'rgba(255,255,255,0.07)',
    headerBorder:    'rgba(255,255,255,0.05)',
    rowBorder:       'rgba(255,255,255,0.05)',
    panelBg:         'rgba(10,28,55,0.5)',
    panelBorder:     'rgba(255,255,255,0.06)',
    arcTrack:        'rgba(255,255,255,0.06)',
    barTrack:        'rgba(255,255,255,0.06)',
    progressBg:      'rgba(255,255,255,0.04)',
    shimmer:         'sk-shimmer',
    textTitle:       'rgba(255,255,255,0.92)',
    textSub:         'rgba(255,255,255,0.28)',
    textLabel:       'rgba(255,255,255,0.85)',
    textSecondary:   'rgba(255,255,255,0.35)',
    textMuted:       'rgba(255,255,255,0.25)',
    textFaint:       'rgba(255,255,255,0.15)',
    textLive:        'rgba(255,255,255,0.3)',
    textOffline:     'rgba(243,156,18,0.8)',
    textPending:     'rgba(255,255,255,0.35)',
    offlinePillBg:   'rgba(243,156,18,0.12)',
    offlinePillColor:'#F39C12',
    toggleBg:        'rgba(255,255,255,0.06)',
    toggleBorder:    'rgba(255,255,255,0.10)',
    toggleColor:     'rgba(255,255,255,0.5)',
    runBtnColor:     'rgba(52,152,219,0.6)',
    runBtnHover:     '#3498DB',
    legendColor:     'rgba(255,255,255,0.25)',
    footerColor:     'rgba(255,255,255,0.15)',
    countdownColor:  'rgba(255,255,255,0.15)',
    cardShadow:      '0 8px 32px rgba(0,0,0,0.4)',
    cardShadowDone:  '0 8px 32px rgba(0,0,0,0.4)',
  },
  light: {
    pageBg: (mx, my) => `
      radial-gradient(ellipse 70% 55% at ${mx}% ${my}%, rgba(52,152,219,0.10) 0%, transparent 65%),
      radial-gradient(ellipse 60% 50% at 80% 10%, rgba(26,188,156,0.07) 0%, transparent 55%),
      #EEF4FB
    `,
    cardBg:          'rgba(255,255,255,0.85)',
    cardBorder:      'rgba(0,0,0,0.07)',
    headerBorder:    'rgba(0,0,0,0.05)',
    rowBorder:       'rgba(0,0,0,0.06)',
    panelBg:         'rgba(255,255,255,0.75)',
    panelBorder:     'rgba(0,0,0,0.06)',
    arcTrack:        'rgba(0,0,0,0.08)',
    barTrack:        'rgba(0,0,0,0.07)',
    progressBg:      'rgba(0,0,0,0.05)',
    shimmer:         'sk-shimmer-light',
    textTitle:       '#0D1B2A',
    textSub:         '#5a6e82',
    textLabel:       '#0D1B2A',
    textSecondary:   '#5a6e82',
    textMuted:       '#7a8d9f',
    textFaint:       '#aabbcc',
    textLive:        '#7a8d9f',
    textOffline:     '#B7770D',
    textPending:     'rgba(0,0,0,0.35)',
    offlinePillBg:   'rgba(243,156,18,0.15)',
    offlinePillColor:'#B7770D',
    toggleBg:        'rgba(0,0,0,0.06)',
    toggleBorder:    'rgba(0,0,0,0.10)',
    toggleColor:     '#5a6e82',
    runBtnColor:     '#3498DB',
    runBtnHover:     '#1B6CA8',
    legendColor:     '#7a8d9f',
    footerColor:     '#aabbcc',
    countdownColor:  '#aabbcc',
    cardShadow:      '0 8px 32px rgba(0,0,0,0.08)',
    cardShadowDone:  '0 8px 32px rgba(0,0,0,0.10)',
  },
}

// ── Accent colors ─────────────────────────────────────────────
const ACCENT = {
  aegean: { border: '#3498DB', glow: 'rgba(52,152,219,0.25)',  text: '#60b4f0', arc: '#3498DB' },
  teal:   { border: '#1ABC9C', glow: 'rgba(26,188,156,0.25)',  text: '#4dd9c0', arc: '#1ABC9C' },
  amber:  { border: '#F39C12', glow: 'rgba(243,156,18,0.25)',  text: '#f5b942', arc: '#F39C12' },
  coral:  { border: '#E74C3C', glow: 'rgba(231,76,60,0.25)',   text: '#eb6b5e', arc: '#E74C3C' },
}

// ── Float durations — each card has its own organic rhythm ────
// Intentionally unsynchronised so no two cards ever bob in unison
const FLOAT_DUR = ['2.8s', '3.3s', '3.8s', '4.2s']

const SK_WIDTHS = ['68%','54%','80%','61%','74%','50%','66%','78%','57%','71%','83%','59%','75%','63%']

// ── Scroll-triggered float hook ───────────────────────────────
// threshold 0.08 fires early enough that the float starts while card is still entering view
function useScrollFloat() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
}

// ── Icons ─────────────────────────────────────────────────────
function IconCheck() {
  return (
    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
      <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconX() {
  return (
    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
      <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" />
    </svg>
  )
}
function IconOffline() {
  return (
    <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
      <circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 3v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function IconSun() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.4 3.4l1.27 1.27M11.33 11.33l1.27 1.27M11.33 3.4l-1.27 1.27M3.4 11.33l-1.27 1.27"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function IconMoon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
      <path d="M13.5 10.5A6 6 0 015.5 2.5 6.002 6.002 0 0011.5 14a6 6 0 002-3.5z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Circular arc progress ─────────────────────────────────────
function ArcProgress({ pct, color, trackColor }) {
  const r = 18
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  return (
    <svg width="44" height="44" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx="22" cy="22" r={r} fill="none" stroke={trackColor} strokeWidth="2.5" />
      <circle cx="22" cy="22" r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
    </svg>
  )
}

// ── Skeleton row ──────────────────────────────────────────────
function SkeletonRow({ index, t }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderColor: t.rowBorder }}>
      <div className={`${t.shimmer} w-5 h-5 rounded-full flex-shrink-0`}
        style={{ animationDelay: `${index * 60}ms` }} />
      <div className={`${t.shimmer} h-2 rounded-full`}
        style={{ width: SK_WIDTHS[index % SK_WIDTHS.length], animationDelay: `${index * 60 + 120}ms` }} />
    </div>
  )
}

// ── Status row ────────────────────────────────────────────────
function StatusRow({ label, state, index, t }) {
  const resolved = useRef(false)
  const [popped, setPopped] = useState(false)

  useEffect(() => {
    if (!resolved.current && state !== 'loading') {
      resolved.current = true
      setPopped(true)
      const timer = setTimeout(() => setPopped(false), 400)
      return () => clearTimeout(timer)
    }
  }, [state])

  if (state === 'loading') return <SkeletonRow index={index} t={t} />

  const isTrue    = state === true
  const isOffline = state === null

  const iconBg    = isTrue ? 'rgba(26,188,156,0.15)' : isOffline ? 'rgba(243,156,18,0.15)' : 'rgba(231,76,60,0.12)'
  const iconColor = isTrue ? '#1ABC9C' : isOffline ? '#F39C12' : '#E74C3C'
  const isTech    = label.includes('/') || label.includes('  ')

  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderColor: t.rowBorder }}>
      <div
        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${popped ? 'animate-pop-in' : ''}`}
        style={{
          background: iconBg,
          color: iconColor,
          boxShadow: isTrue ? '0 0 10px rgba(26,188,156,0.25)' : 'none',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {isTrue ? <IconCheck /> : isOffline ? <IconOffline /> : <IconX />}
      </div>
      <span
        className="text-xs flex-1 tracking-wide"
        style={{
          fontFamily: isTech ? 'var(--font-mono)' : 'var(--font-sans)',
          color: isTrue ? t.textLabel : isOffline ? t.textOffline : t.textPending,
          transition: 'color 0.4s ease',
        }}
      >
        {label}
      </span>
      {isOffline && (
        <span className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: t.offlinePillBg, color: t.offlinePillColor, fontFamily: 'var(--font-mono)' }}>
          offline
        </span>
      )}
    </div>
  )
}

// ── Person card ───────────────────────────────────────────────
function GroupCard({ group, results, cardIndex, t }) {
  const [cardRef, visible] = useScrollFloat()
  const accent  = ACCENT[group.color]
  const total   = group.checks.length
  const done    = results.filter(r => r === true).length
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0
  const allDone = done === total

  const animStyle = visible
    ? {
        animation: `cardEnter 0.7s cubic-bezier(0.22,1,0.36,1) forwards, cardFloat ${FLOAT_DUR[cardIndex]} ease-in-out 0.7s infinite`,
        willChange: 'transform, opacity',
      }
    : {
        opacity: 0,
        transform: 'translateY(50px)',
        transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        willChange: 'transform, opacity',
      }

  return (
    <div
      ref={cardRef}
      style={{
        ...animStyle,
        background: t.cardBg,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: `1px solid ${t.cardBorder}`,
        borderTop: `2px solid ${accent.border}`,
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: allDone
          ? `0 0 48px ${accent.glow}, ${t.cardShadowDone}`
          : t.cardShadow,
      }}
    >
      {/* Card header */}
      <div className="px-5 py-4 flex items-center gap-4"
        style={{ borderBottom: `1px solid ${t.headerBorder}` }}>
        <ArcProgress pct={pct} color={accent.arc} trackColor={t.arcTrack} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold truncate" style={{ color: t.textTitle }}>
              {group.person}
            </h2>
            <span className="text-xs flex-shrink-0" style={{ color: accent.text, fontFamily: 'var(--font-mono)' }}>
              {done}/{total}
            </span>
          </div>
          <p className="text-xs mt-0.5 truncate"
            style={{ color: t.textSecondary, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            {group.role}
          </p>
          <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: t.barTrack }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${accent.border}, ${accent.border}cc)`,
                transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: `0 0 8px ${accent.glow}`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Check rows */}
      <div className="px-5">
        {group.checks.map((check, i) => (
          <StatusRow
            key={check.label}
            label={check.label}
            state={results[i] ?? 'loading'}
            index={i}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export function StatusPage() {
  const [results, setResults] = useState(
    CHECK_GROUPS.map(g => Array(g.checks.length).fill('loading'))
  )
  const [countdown, setCountdown]   = useState(15)
  const [isChecking, setIsChecking] = useState(false)
  const [mouse, setMouse]           = useState({ x: 50, y: 40 })
  const [dark, setDark]             = useState(() => {
    try { return localStorage.getItem('hrms_theme') !== 'light' } catch { return true }
  })

  const t = THEMES[dark ? 'dark' : 'light']

  const toggleTheme = () => {
    setDark(d => {
      const next = !d
      try { localStorage.setItem('hrms_theme', next ? 'dark' : 'light') } catch {}
      return next
    })
  }

  // Parallax background
  useEffect(() => {
    const handler = e => setMouse({
      x: (e.clientX / window.innerWidth)  * 100,
      y: (e.clientY / window.innerHeight) * 100,
    })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // Run all probes
  const runChecks = async () => {
    setIsChecking(true)
    setCountdown(15)
    setResults(CHECK_GROUPS.map(g => Array(g.checks.length).fill('loading')))

    await Promise.all(
      CHECK_GROUPS.map(async (group, gi) => {
        await Promise.all(
          group.checks.map(async (check, ci) => {
            let value
            if      (check.type === 'static')  value = check.value
            else if (check.type === 'backend') value = await probeEndpoint(check.method, check.path, check.body)
            else if (check.type === 'export')  value = await probeExport(check.importFn, check.exportName)
            else if (check.type === 'test')    value = await probeTestFile(check.importFn)
            setResults(prev => {
              const next = prev.map(r => [...r])
              next[gi][ci] = value
              return next
            })
          })
        )
      })
    )
    setIsChecking(false)
  }

  useEffect(() => {
    runChecks()
    const interval = setInterval(runChecks, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000)
    return () => clearInterval(tick)
  }, [])

  // Grand totals
  const allGroups  = CHECK_GROUPS.map((g, gi) => ({
    total: g.checks.length,
    done:  results[gi].filter(r => r === true).length,
  }))
  const grandTotal = allGroups.reduce((a, b) => a + b.total, 0)
  const grandDone  = allGroups.reduce((a, b) => a + b.done,  0)
  const grandPct   = grandTotal > 0 ? Math.round((grandDone / grandTotal) * 100) : 0

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: t.pageBg(mouse.x, mouse.y),
        transition: 'background 0.3s ease',
      }}
    >
      {/* Countdown progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50"
        style={{ height: '2px', background: t.progressBg }}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #3498DB, #1ABC9C)',
            width: isChecking ? '100%' : `${(countdown / 15) * 100}%`,
            transition: isChecking ? 'width 0.3s ease' : 'width 1s linear',
            boxShadow: '0 0 10px rgba(52,152,219,0.7)',
          }}
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-8 h-8 rounded-full"
        style={{
          background: t.toggleBg,
          border: `1px solid ${t.toggleBorder}`,
          color: t.toggleColor,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'background 0.25s ease, color 0.25s ease',
          cursor: 'pointer',
        }}
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <IconSun /> : <IconMoon />}
      </button>

      <div className="max-w-2xl mx-auto px-4 py-14">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="animate-breathe absolute w-2 h-2 rounded-full" style={{ background: '#1ABC9C' }} />
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#1ABC9C' }} />
            </div>
            <span className="text-xs tracking-widest uppercase"
              style={{ color: t.textLive, fontFamily: 'var(--font-mono)' }}>
              live
            </span>
            <span className="text-xs"
              style={{ color: t.countdownColor, fontFamily: 'var(--font-mono)' }}>
              — next refresh in {countdown}s
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight" style={{ color: t.textTitle }}>
            MedRecord
          </h1>
          <p className="text-sm mt-1 tracking-wide"
            style={{ color: t.textSub, fontFamily: 'var(--font-mono)' }}>
            build status
          </p>

          {/* Grand progress panel */}
          <div className="mt-8 rounded-2xl px-6 py-5 text-left"
            style={{
              background: t.panelBg,
              border: `1px solid ${t.panelBorder}`,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs tracking-widest uppercase mb-1"
                  style={{ color: t.textMuted, fontFamily: 'var(--font-mono)' }}>
                  overall completion
                </p>
                <p className="text-4xl font-bold"
                  style={{ color: t.textTitle, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  {grandPct}
                  <span className="text-xl" style={{ color: t.textFaint }}>%</span>
                </p>
              </div>
              <p className="text-sm pb-1"
                style={{ color: t.textMuted, fontFamily: 'var(--font-mono)' }}>
                {grandDone}{' '}
                <span style={{ color: t.textFaint }}>/ {grandTotal}</span>
              </p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: t.barTrack }}>
              <div
                style={{
                  height: '100%',
                  width: `${grandPct}%`,
                  background: 'linear-gradient(90deg, #3498DB 0%, #1ABC9C 100%)',
                  borderRadius: '9999px',
                  transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: '0 0 12px rgba(26,188,156,0.4)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Legend + run checks button */}
        <div className="flex items-center gap-5 mb-6 px-1">
          {[
            { color: '#1ABC9C', label: 'complete' },
            { color: '#E74C3C', label: 'pending' },
            { color: '#F39C12', label: 'server offline' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs"
              style={{ color: t.legendColor, fontFamily: 'var(--font-mono)' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
              {label}
            </span>
          ))}
          <button
            onClick={runChecks}
            className="ml-auto text-xs"
            style={{
              color: t.runBtnColor,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              transition: 'color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.color = t.runBtnHover}
            onMouseLeave={e => e.currentTarget.style.color = t.runBtnColor}
          >
            run checks
          </button>
        </div>

        {/* Cards — each floats in independently on scroll */}
        <div className="flex flex-col gap-6">
          {CHECK_GROUPS.map((group, gi) => (
            <GroupCard
              key={group.person}
              group={group}
              results={results[gi]}
              cardIndex={gi}
              t={t}
            />
          ))}
        </div>

        {/* Footer */}
        <p className="text-center mt-12 text-xs"
          style={{ color: t.footerColor, fontFamily: 'var(--font-mono)' }}>
          TEAM_PROGRESS.md — repo root
        </p>
      </div>
    </div>
  )
}
