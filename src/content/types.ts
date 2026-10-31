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

/** The card on the home page. The long-form story lives in a CaseStudy. */
export interface Project {
  id: string
  title: string
  tagline: string
  status?: string
  /** Counted against the code before publishing; never invented. */
  facts?: { label: string; value: string }[]
  stack: { group: string; items: string[] }[]
  architecture?: {
    nodes: ArchNode[]
    edges: ArchEdge[]
    caption?: string
  }
  /** Where the full case study lives, a path from the site root (one of site.pages). */
  href: string
}

export interface Decision {
  title: string
  problem: string
  chose: string
  tradeoff: string
}

export interface FlowStep {
  title: string
  detail: string
  /** Workflow states the record passes through at this step. */
  states?: string[]
}

export interface CaseStudy {
  id: string
  title: string
  tagline: string
  status: string
  facts: { label: string; value: string }[]
  /** Headings for the on-page contents, in reading order. */
  sections: { id: string; title: string }[]
  problem: string[]
  capabilities: { title: string; detail: string }[]
  architecture: { intro: string; layers: { title: string; detail: string }[] }
  role: { summary: string; responsibilities: string[] }
  decisions: Decision[]
  flow: FlowStep[]
  testing: { summary: string; items: string[]; next: string[] }
  stack: { group: string; items: string[] }[]
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

export type PageKey = 'home' | 'healthcare'

export interface PageMeta {
  /** Path from the site root, with a leading and trailing slash. */
  path: string
  title: string
  description: string
}

export interface NavItem {
  id: string
  label: string
}
