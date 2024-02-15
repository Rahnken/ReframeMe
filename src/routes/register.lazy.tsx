import { createLazyFileRoute } from '@tanstack/react-router'
import { RegisterUser } from '../components/register'

export const Route = createLazyFileRoute('/register')({
  component: () => <RegisterUser />
})