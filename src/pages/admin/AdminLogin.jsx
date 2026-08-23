import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import logo from '../../assets/genesis-logo.png'

export default function AdminLogin() {
  const { session, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={logo} alt="Genesis Esports crest" className="h-16 w-auto" />
          <h1 className="mt-4 font-display text-3xl uppercase tracking-wide text-bone">
            Admin <span className="text-genesis">Access</span>
          </h1>
          <p className="mt-1 text-sm text-steel">Sign in to manage the Genesis Esports site.</p>
        </div>

        <form onSubmit={handleSubmit} className="border hairline bg-char/60 p-6">
          <label className="mb-1 block font-mono text-[11px] uppercase tracking-widest2 text-steel">Email</label>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full border hairline bg-void px-3 py-2 text-sm text-bone focus:border-genesis focus:outline-none"
          />

          <label className="mb-1 block font-mono text-[11px] uppercase tracking-widest2 text-steel">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full border hairline bg-void px-3 py-2 text-sm text-bone focus:border-genesis focus:outline-none"
          />

          {error && <p className="mb-4 text-sm text-genesis">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full border border-genesis bg-genesis py-2.5 font-mono text-xs uppercase tracking-widest2 text-void hover:bg-genesis-glow disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-steel2">
          Admin accounts are created in the Supabase dashboard under Authentication → Users.
        </p>
      </div>
    </div>
  )
}
