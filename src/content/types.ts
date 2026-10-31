export type NodeKind = 'client' | 'api' | 'data' | 'infra'

export interface ArchNode {
  id: string
  label: string
  sub?: string
  /** One plain-words line shown on hover, focus or tap. */
  note?: string
  /** Position as a percentage (0-100) of the diagram box. */
  x: number
  y: number
  kind: NodeKind
}

export interface ArchEdge {
  from: string
  to: string
  label?: string
}

export interface Project {
  /** Slug; also the URL hash, e.g. #healthcare */
  id: string
  title: string
  tagline: string
  status?: string
  problem: string
  role: string
  features: string[]
  /** Verifiable counts only. */
  facts?: { label: string; value: string }[]
  stack: { group: string; items: string[] }[]
  architecture?: {
    nodes: ArchNode[]
    edges: ArchEdge[]
    caption?: string
  }
  /** Real screenshots only. */
  media?: { src: string; alt: string; caption?: string }[]
  links?: { label: string; href: string; kind: 'repo' | 'demo' | 'article' }[]
}

export type ServiceIcon = 'server' | 'plug' | 'database' | 'boxes' | 'shield' | 'wrench' | 'rocket'

export interface Service {
  id: string
  title: string
  benefit: string
  icon: ServiceIcon
}

export interface SkillGroup {
  id: string
  title: string
  how: string
  items: string[]
}

export interface ProcessStep {
  id: string
  title: string
  detail: string
}

export interface NavItem {
  id: string
  label: string
}
