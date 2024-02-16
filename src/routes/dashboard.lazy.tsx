import { createLazyFileRoute } from '@tanstack/react-router'
import { Dashboard } from '../components/dashboard'

export const Route = createLazyFileRoute('/dashboard')({
  component: () => <Dashboard />
})

