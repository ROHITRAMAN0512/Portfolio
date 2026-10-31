import { useMemo, useState } from 'react'
import { LazyMotion, domAnimation, m } from 'framer-motion'
import type { ArchEdge, ArchNode, NodeKind } from '../../content/types'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { nextActive, type NodeEvent } from './nodeFocus'

interface DiagramProps {
  nodes: ArchNode[]
  edges: ArchEdge[]
  caption?: string
  /** Accessible name for the whole diagram. */
  label: string
  /** Show the travelling request dot (ignored under reduced motion). */
  animate?: boolean
  /** Node ids the dot visits, in order. */
  flow?: string[]
}

const kindClass: Record<NodeKind, string> = {
  client: 'border-line bg-surface',
  api: 'border-accent/40 bg-surface',
  data: 'border-line bg-surface-2',
  infra: 'border-dashed border-line bg-surface',
}

/** Renders any {nodes, edges}. Node x/y are percentages of the box. */
export function Diagram({ nodes, edges, caption, label, animate = false, flow = [] }: DiagramProps) {
  const reduced = usePrefersReducedMotion()
  const [activeId, setActiveId] = useState<string | null>(null)
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])
  const active = activeId ? byId.get(activeId) : undefined
  const send = (id: string, event: NodeEvent) => setActiveId((cur) => nextActive(cur, id, event))

  const flowNodes = flow.map((id) => byId.get(id)).filter((n): n is ArchNode => n !== undefined)
  const showDot = animate && !reduced && flowNodes.length >= 2

  return (
    <figure className="@container w-full" aria-label={label}>
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 size-full"
        >
          {edges.map((e) => {
            const a = byId.get(e.from)
            const b = byId.get(e.to)
            if (!a || !b) return null
            const lit = activeId === e.from || activeId === e.to
            const dashed = a.kind === 'infra' || b.kind === 'infra'
            return (
              <line
                key={`${e.from}-${e.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={lit ? 'var(--color-accent)' : 'var(--color-line)'}
                strokeWidth={lit ? 2 : 1.5}
                strokeDasharray={dashed ? '4 4' : undefined}
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>

        {showDot && (
          <LazyMotion features={domAnimation} strict>
            <m.span
              aria-hidden="true"
              className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]"
              initial={{ left: `${flowNodes[0]!.x}%`, top: `${flowNodes[0]!.y}%`, opacity: 0 }}
              animate={{
                left: flowNodes.map((n) => `${n.x}%`),
                top: flowNodes.map((n) => `${n.y}%`),
                opacity: flowNodes.map((_, i) => (i === 0 || i === flowNodes.length - 1 ? 0 : 1)),
              }}
              transition={{ duration: 5, ease: 'linear', repeat: Infinity, repeatDelay: 0.6 }}
            />
          </LazyMotion>
        )}

        {nodes.map((n) => (
          <button
            key={n.id}
            type="button"
            onPointerEnter={(e) => send(n.id, { type: 'pointerenter', pointerType: e.pointerType })}
            onPointerLeave={(e) => send(n.id, { type: 'pointerleave', pointerType: e.pointerType })}
            onFocus={(e) => send(n.id, { type: 'focus', focusVisible: e.currentTarget.matches(':focus-visible') })}
            onBlur={() => send(n.id, { type: 'blur' })}
            onClick={() => send(n.id, { type: 'click' })}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            className={`absolute before:absolute before:-inset-x-3 before:-inset-y-3 before:content-[''] max-w-[78px] -translate-x-1/2 -translate-y-1/2 rounded-lg border px-1.5 py-1.5 text-center text-[11px] leading-tight transition-colors @md:px-3 @md:py-2 @md:text-sm @min-[480px]:max-w-[150px] ${kindClass[n.kind]} ${
              activeId === n.id ? '!border-accent text-accent' : 'text-text'
            }`}
          >
            <span className="block font-medium">{n.label}</span>
            {n.sub && <span className="mt-0.5 hidden font-mono text-[11px] text-muted @min-[480px]:block">{n.sub}</span>}
          </button>
        ))}
      </div>

      <p aria-hidden="true" className="mt-3 min-h-16 text-sm text-muted sm:min-h-12">
        {active?.note ? (
          <>
            <span className="text-text">{active.label}. </span>
            {active.note}
          </>
        ) : (
          'Hover, focus or tap a block to see what it does.'
        )}
      </p>

      {caption && <figcaption className="font-mono text-xs text-muted">{caption}</figcaption>}

      <ul className="sr-only">
        {nodes.map((n) => {
          const links = edges
            .filter((e) => e.from === n.id || e.to === n.id)
            .map((e) => byId.get(e.from === n.id ? e.to : e.from)?.label)
            .filter(Boolean)
            .join(', ')
          return (
            <li key={n.id}>
              {n.label}
              {n.sub ? ` (${n.sub})` : ''}. {n.note ?? ''} {links ? `Connected to: ${links}.` : ''}
            </li>
          )
        })}
      </ul>
    </figure>
  )
}
