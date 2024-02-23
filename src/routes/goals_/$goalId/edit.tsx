import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/goals/$goalId/edit')({
  component: () => <div>Hello /goals/$goalId/edit!</div>
})