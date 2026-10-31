import type { Project } from '../content/types'

export type ProjectBlock =
  | 'problem'
  | 'role'
  | 'features'
  | 'facts'
  | 'architecture'
  | 'stack'
  | 'media'
  | 'links'

/** The case-study blocks that have data, in display order. */
export function projectBlocks(p: Project): ProjectBlock[] {
  const blocks: ProjectBlock[] = []
  if (p.problem.trim()) blocks.push('problem')
  if (p.role.trim()) blocks.push('role')
  if (p.features.length > 0) blocks.push('features')
  if (p.facts && p.facts.length > 0) blocks.push('facts')
  if (p.architecture && p.architecture.nodes.length > 0) blocks.push('architecture')
  if (p.stack.length > 0) blocks.push('stack')
  if (p.media && p.media.length > 0) blocks.push('media')
  if (p.links && p.links.length > 0) blocks.push('links')
  return blocks
}
