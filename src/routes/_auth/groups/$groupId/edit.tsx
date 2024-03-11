import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/groups/$groupId/edit')({
  component: () => <div>Hello /_auth/groups/$groupId/edit!</div>
})