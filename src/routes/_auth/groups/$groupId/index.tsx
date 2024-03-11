import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/groups/$groupId/')({
  component: () => <div>Hello /_auth/groups/$groupId/!</div>
})