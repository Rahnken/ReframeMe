import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard/groups/$groupId/edit')({
  component: () => <div>Hello /_auth/dashboard/groups/$groupId/edit!</div>
})