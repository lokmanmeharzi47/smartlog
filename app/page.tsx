import { redirect } from 'next/navigation'

// Root page: always redirect to /dashboard
// Middleware handles auth check before we reach here
export default function Home() {
  redirect('/dashboard')
}
