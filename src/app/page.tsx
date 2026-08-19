'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const WORDMARK = ['E', 'd', 'u', 'F', 'l', 'o', 'w']

const WAYS = [
  ['01', 'By signup', 'Register with any email and password — nothing else. Courses open the moment you are in.'],
  ['02', 'By enrolment', 'Open a published course, press enrol, start the first lesson.'],
  ['03', 'By completion', 'Tick the last lesson, pass the final quiz, collect the certificate.'],
]

const DETAILS_GOAL = [
  ['01', 'One page previews', 'Course pages carry their lesson list.', '—'],
  ['02', 'Learning shows', 'Progress bar per course, in the sidebar.', '—'],
  ['03', 'Own record', 'Quiz attempts saved per student.', '—'],
]

const DETAILS_BUILD = [
  ['01', 'Next.js 16', 'App Router, server components and actions.', '16'],
  ['02', 'Prisma 7', 'SQLite locally, Postgres on deploy.', '7'],
  ['03', 'Auth.js', 'Credentials, hashed with bcrypt.', '—'],
]

const UNITS = [
  ['Roles', 'Student and admin, one dashboard each', '2'],
  ['Courses', 'Seeded with three ready to learn', '3'],
  ['Certificates', 'One code, one image, prints to A4', '∞'],
]

type StyleKey = 'structured' | 'hands' | 'quiz'
const STYLES: Record<StyleKey, { label: string; d: string; width: number }> = {
  structured: { label: 'Structured', d: 'M40 330 L40 200 L210 200 L210 130 L40 130', width: 2.5 },
  hands: { label: 'Hands on', d: 'M40 330 L40 100 L210 100 L210 220 L40 220', width: 4 },
  quiz: { label: 'Quiz-first', d: 'M40 330 L40 210 L210 210 L210 100 L40 100', width: 1.5 },
}
const FACTS: Record<StyleKey, string[]> = {
  structured: ['Lesson-first, quiz last', 'Complete in order', 'Progress fills per lesson'],
  hands: ['Jump straight in', 'Preview lessons open', 'Learn by doing'],
  quiz: ['Quiz up front', 'Then lessons to pass', 'Certificates tie it off'],
}

const HEROSTATS: [string, string][] = [
  ['Courses', '3'],
  ['Lessons', '6'],
  ['Quizzes', '1/course'],
  ['Certificates', 'On passing'],
]

/* ---- The single travelling product: the course page ---- */
function CourseCard() {
  return (
    <div className="relative hidden h-[560px] w-[340px] shrink-0 flex-col overflow-hidden border border-[rgba(20,28,43,0.5)] bg-[#EFE9DD] md:flex">
      <div className="flex items-center justify-between border-b border-[rgba(20,28,43,0.24)] px-4 py-3">
        <span className="landing-mono text-[10px] text-[#4A5364]">EduFlow — Course</span>
        <span className="landing-mono text-[10px] text-[#2C4A8F]">✓ Progress</span>
      </div>
      <div className="flex flex-1 flex-col px-5 py-5">
        <p className="landing-mono text-[10px] text-[#4A5364]">INTRODUCTION</p>
        <p className="mt-2 text-xl font-semibold leading-snug tracking-tight">Learn out loud, one course at a time.</p>

        <div className="mt-5 flex items-center gap-2">
          <div className="h-2 flex-1 border border-[#141C2B]">
            <div className="h-full bg-[#2C4A8F]" style={{ width: '38%' }} />
          </div>
          <span className="landing-mono text-[9px] text-[#4A5364]">38%</span>
        </div>
        <p className="landing-mono mt-1 text-[9px] text-[#767E8C]">3 OF 8 LESSONS COMPLETE</p>

        <div className="mt-6 flex-1">
          {[
            ['01', 'Getting started', 'done'],
            ['02', 'Your first lesson', 'done'],
            ['03', 'Building momentum', 'done'],
            ['04', 'Deep dive', 'current'],
            ['05', 'Putting it together', '—'],
            ['06', 'Final quiz', '—'],
          ].map(([num, name, state], i) => (
            <div key={num} className={'flex items-center justify-between py-2.5 ' + (i === 0 ? '' : 'border-t border-[rgba(20,28,43,0.1)]')}>
              <span className="landing-mono text-[9px] text-[#767E8C]">{num}</span>
              <span className="text-[13px] text-[#141C2B]">{name}</span>
              <span
                className={
                  'landing-mono text-[9px] ' +
                  (state === 'done' ? 'text-[#2C4A8F]' : state === 'current' ? 'text-[#141C2B] uppercase' : 'text-[#767E8C]')
                }
              >
                {state}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[rgba(20,28,43,0.24)] pt-3">
          <span className="landing-mono text-[9px] text-[#4A5364]">EduFlow</span>
          <span className="landing-mono text-[9px] text-[#4A5364]">© 2026</span>
        </div>
      </div>
    </div>
  )
}

/* ---- Demonstration: the product's output drawing itself ---- */
function Demo({ style }: { style: StyleKey }) {
  const pathRef = useRef<SVGPathElement | null>(null)
  const first = useRef(true)

  useEffect(() => {
    const p = pathRef.current
    if (!p || localStorage.getItem('ef-motion') === 'off') return
    const len = p.getTotalLength()
    p.style.strokeDasharray = String(len)
    p.style.strokeDashoffset = String(len)
    const raf = requestAnimationFrame(() => {
      p.style.transition = 'stroke-dashoffset 1900ms cubic-bezier(0.65,0,0.35,1)'
      p.style.strokeDashoffset = '0'
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const p = pathRef.current
    if (!p || localStorage.getItem('ef-motion') === 'off') return
    // Redraw the new path from scratch
    const len = p.getTotalLength()
    p.style.transition = 'none'
    p.style.strokeDasharray = String(len)
    p.style.strokeDashoffset = String(len)
    p.getBoundingClientRect()
    p.style.transition = 'stroke-dashoffset 1200ms cubic-bezier(0.65,0,0.35,1)'
    p.style.strokeDashoffset = '0'
  }, [style])

  return (
    <div className="border border-[rgba(20,28,43,0.24)] bg-[#E5DED0] p-5">
      <p className="landing-mono text-[#4A5364]">The course page, live — {STYLES[style].label.toLowerCase()}</p>
      <svg
        viewBox="0 0 260 400"
        fill="none"
        className="mt-4 w-full"
        role="img"
        aria-label={'Learning path: ' + STYLES[style].label}
      >
        <rect x="8" y="8" width="244" height="384" fill="#EFE9DD" stroke="#141C2B" strokeWidth="1.5" />
        <rect x="20" y="24" width="220" height="30" fill="none" stroke="#141C2B" />
        <circle cx="34" cy="39" r="4.5" fill="#2C4A8F" />
        <text x="46" y="43" fontFamily="monospace" fontSize="10" letterSpacing="2" fill="#141C2B">
          EDUFLOW
        </text>
        <path
          ref={pathRef}
          d={STYLES[style].d}
          stroke="#2C4A8F"
          strokeWidth={STYLES[style].width}
          strokeLinecap="square"
        />
        <line x1="40" y1="400" x2="40" y2="60" stroke="#D1C8B4" />
        <circle cx="0" cy="0" r="4" fill="#2C4A8F" opacity="0.9">
          <animateMotion dur="3s" repeatCount="indefinite" path={STYLES[style].d} />
        </circle>
      </svg>
      <div className="mt-4 grid gap-1">
        {FACTS[style].map((f, i) => (
          <p key={i} className="landing-mono flex items-baseline justify-between text-[#4A5364]">
            <span className="uppercase">{f}</span>
            <span className="text-[#2C4A8F]">→</span>
          </p>
        ))}
      </div>
    </div>
  )
}

function DemoSection() {
  const [style, setStyle] = useState<StyleKey>('structured')
  return (
    <section id="demo" className="mt-20">
      <Reveal>
        <p className="landing-mono text-[#767E8C]">02 — DEMONSTRATION</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#141C2B]">
          The course page draws its path as you scroll.
        </h2>
      </Reveal>
      <Reveal className="mt-8">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Learning style">
          {(Object.keys(STYLES) as StyleKey[]).map((key) => (
            <button
              key={key}
              aria-pressed={key === style}
              onClick={() => setStyle(key)}
              className={
                'landing-mono border px-4 py-2 uppercase transition-colors ' +
                (key === style
                  ? 'border-[#2C4A8F] bg-[#2C4A8F] text-[#EFE9DD]'
                  : 'border-[#141C2B] bg-transparent text-[#141C2B] hover:bg-[rgba(20,28,43,0.06)]')
              }
            >
              {STYLES[key].label}
            </button>
          ))}
        </div>
        <div className="mt-6 max-w-2xl">
          <Demo style={style} />
        </div>
      </Reveal>
    </section>
  )
}

/* ---- One-shot reveal on intersection ---- */
function Reveal(props: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(16px)'
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.style.transition = 'opacity .8s ease, transform .8s cubic-bezier(0.2,0.6,0.2,1)'
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            obs.disconnect()
          }
        })
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={props.className}>
      {props.children}
    </div>
  )
}

/* ---- Decorative constellation ---- */
function Starfield({ count, seed }: { count: number; seed: number }) {
  const refs = useRef<(SVGCircleElement | null)[]>([])
  useEffect(() => {
    if (localStorage.getItem('ef-motion') === 'off') return
    const circles = refs.current.filter(Boolean) as SVGCircleElement[]
    requestAnimationFrame(() => {
      circles.forEach((c, i) => {
        c.animate(
          [
            { transform: 'translate(0,0)', opacity: 0.1 },
            { transform: 'translate(' + ((i % 3) - 1) * 6 + 'px,' + ((i % 5) - 2) * 5 + 'px)', opacity: 0.55 },
            { transform: 'translate(0,0)', opacity: 0.1 },
          ],
          { duration: 5000 + (i % 7) * 900, iterations: Infinity, easing: 'ease-in-out' }
        )
      })
    })
  }, [])
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" fill="none" className="pointer-events-none opacity-80" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const n = seed * 99991 + i * 7919
        const x = (n % 1000) / 1000
        const y = ((Math.floor(n / 13) % 1000) / 1000) * 120 + 60
        const r = (n % 9) / 10 + 0.8
        return (
          <circle
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            cx={x * 180}
            cy={y}
            r={r}
            fill="#2C4A8F"
            opacity={0.1}
          />
        )
      })}
    </svg>
  )
}

function Wordmark() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const letters = Array.from(el.querySelectorAll<HTMLElement>('.spread-letter'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      letters.forEach((l) => l.classList.add('on'))
      return
    }
    letters.forEach((l, i) => {
      setTimeout(() => l.classList.add('on'), 60 + i * 40)
    })
  }, [])
  return (
    <div className="spread" aria-hidden="true" ref={ref}>
      {WORDMARK.map((letter, i) => (
        <span key={i} className="spread-letter text-[#141C2B]" style={{ fontSize: 'clamp(40px, 9vw, 96px)', lineHeight: 1 }}>
          {letter}
        </span>
      ))}
    </div>
  )
}

const CTA_CLASS =
  'landing-mono inline-flex h-11 items-center justify-center border border-[#141C2B] bg-[#141C2B] px-6 text-[#EFE9DD] uppercase transition-colors hover:bg-[#2C4A8F] hover:border-[#2C4A8F]'
const CTA_GHOST =
  'landing-mono inline-flex h-11 items-center justify-center border border-[#141C2B] px-6 text-[#141C2B] uppercase transition-colors hover:bg-[rgba(20,28,43,0.06)]'

function Row({ num, label, desc, value, first }: { num: string; label: string; desc: string; value: string; first?: boolean }) {
  return (
    <div className={'py-5 ' + (first ? '' : 'hairline')}>
      <span className="landing-mono text-[#767E8C]">{num}</span>
      <div className="flex items-baseline justify-between gap-6">
        <div>
          <div className="text-[17px] font-semibold tracking-tight text-[#141C2B]">{label}</div>
          <p className="mt-1 max-w-md text-[15px] leading-relaxed text-[#4A5364]">{desc}</p>
        </div>
        <span className="landing-mono shrink-0 text-right text-[#2C4A8F]">{value}</span>
      </div>
    </div>
  )
}

export default function Landing() {
  const [motion, setMotion] = useState<'on' | 'off'>('on')

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('ef-motion') === 'off') setMotion('off')
  }, [])

  function toggleMotion() {
    const now = motion === 'on' ? 'off' : 'on'
    setMotion(now)
    localStorage.setItem('ef-motion', now)
  }

  return (
    <div className="relative bg-[#E9E2D4] text-[#141C2B]">
      {/* Travelling product — the course page */}
      <div className="landing-fixed" aria-hidden={motion === 'off'}>
        <div className={'landing-mark' + (motion === 'off' ? ' closed' : '')}>
          <CourseCard />
        </div>
      </div>

      {/* Scroll content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-10">
        <Wordmark />

        <header className="pt-4">
          <p className="landing-mono text-[#767E8C]">EDUFLOW — A COURSE PLATFORM</p>
          <h1 className="mt-5 max-w-[13ch] text-[clamp(34px,4.6vw,64px)] font-semibold leading-[1.04] tracking-[-0.02em]">
            Learn out loud, one course at a time — every lesson, every quiz,{" "}
            <span className="em-accent">on a single page.</span>
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/courses" className={CTA_CLASS}>
              Browse catalog
            </Link>
            <Link href="/login" className={CTA_GHOST}>
              Log in
            </Link>
            <button
              onClick={toggleMotion}
              aria-label={'Travel animation ' + motion}
              className="landing-mono ml-auto border border-[#141C2B] px-4 py-2 text-[#767E8C] uppercase transition-colors hover:bg-[rgba(20,28,43,0.06)]"
            >
              {motion === 'on' ? 'Motion on' : 'Motion off'}
            </button>
          </div>

          <div className="hairline mt-12 pt-4">
            <div className="landing-mono flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              {HEROSTATS.map(([label, value]) => (
                <div key={label} className="flex items-baseline gap-3">
                  <span className="uppercase text-[#767E8C]">{label}</span>
                  <span className="uppercase">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="min-h-[40vh]" />

        {/* Argument */}
        <section className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="landing-mono mt-2 text-[#767E8C]">01 — HOW IT WORKS</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em]">From signup to certificate in three steps.</h2>
          </Reveal>
          <Reveal>
            <div>
              {WAYS.map(([num, label, desc], i) => (
                <Row key={num} num={num} label={label} desc={desc} value="" first={i === 0} />
              ))}
            </div>
          </Reveal>
        </section>

        <DemoSection />

        {/* Material */}
        <section className="mt-20 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="landing-mono mt-2 text-[#767E8C]">03 — MATERIALS</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#141C2B]">
              Built under a clear desk — the parts beneath the surface.
            </h2>
          </Reveal>
          <Reveal>
            <div>
              <p className="landing-mono text-[#767E8C]">The goal</p>
              {DETAILS_GOAL.map(([num, label, desc, value], i) => (
                <Row key={num} num={num} label={label} desc={desc} value={value} first={i === 0} />
              ))}
              <p className="landing-mono mt-6 text-[#767E8C]">The build</p>
              {DETAILS_BUILD.map(([num, label, desc, value], i) => (
                <Row key={num} num={num} label={label} desc={desc} value={value} first={i === 0} />
              ))}
            </div>
          </Reveal>
        </section>

        {/* Measurements */}
        <section className="mt-20">
          <Reveal>
            <p className="landing-mono text-[#767E8C]">04 — MEASUREMENTS</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#141C2B]">
              What a course is, in numbers.
            </h2>
          </Reveal>
          <Reveal className="mt-8">
            {UNITS.map(([label, desc, value], i) => (
              <Row key={label} num={String(i + 1).padStart(2, '0')} label={label} desc={desc} value={value} first={i === 0} />
            ))}
          </Reveal>
        </section>

        <Reveal className="mt-20 flex justify-end">
          <Starfield count={26} seed={42} />
        </Reveal>

        {/* Close */}
        <section className="relative mt-20">
          <Reveal>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#141C2B]">
              Make the course yours — <span className="em-accent">start where it is easy.</span>
            </h2>
            <p className="landing-mono mt-4 max-w-xl text-[#4A5364]">
              Log in as a student, browse the catalog, take the demo course end to end. No card, no third-party accounts
              — just a browser.
            </p>
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/courses" className={CTA_CLASS}>
              Browse catalog
            </Link>
            <Link href="/login" className={CTA_GHOST}>
              Log in
            </Link>
            <span className="landing-mono ml-auto text-right text-[#767E8C]">© 2026 — EduFlow / a portfolio LMS</span>
          </Reveal>
          <div className="hairline mt-16" />
        </section>

        {/* Cropped wordmark */}
        <div className="relative mt-10 overflow-hidden">
          <Wordmark />
        </div>
      </div>
    </div>
  )
}