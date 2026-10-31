import type { ProcessStep } from './types'

export const processSteps: ProcessStep[] = [
  {
    id: 'discuss',
    title: 'Discuss the problem',
    detail:
      'We talk through what you need, who will use it and what success looks like. You describe the problem; I ask the questions that shape the answer.',
  },
  {
    id: 'scope',
    title: 'Scope and estimate',
    detail:
      'I write down what will be built, what will not, and how long each part should take, so there are no surprises.',
  },
  {
    id: 'build',
    title: 'Build in milestones',
    detail: 'Work arrives in small pieces you can run and review, not as one big delivery at the end.',
  },
  {
    id: 'test',
    title: 'Test and deploy',
    detail:
      'Each milestone is tested before it ships. I set up the environment and deploy it, with notes on how it runs.',
  },
  {
    id: 'support',
    title: 'Support and maintain',
    detail: 'After launch I can fix issues, make changes and keep the application healthy.',
  },
]
