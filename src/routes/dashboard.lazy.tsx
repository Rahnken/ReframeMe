import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard')({
  component: () => <Dashboard />
})

function Dashboard() {
  return <div className="p-2">Hello from the Dashboard!</div>;
}