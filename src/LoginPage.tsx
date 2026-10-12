import { useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'

type LoginPageProps = {
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (name: string, email: string, password: string) => Promise<void>
}

const demoEmail = 'demo@teamforge.dev'
const demoPassword = 'teamforge123'

function LoginPage({ onLogin, onRegister }: LoginPageProps) {
  const [registerMode, setRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState(demoEmail)
  const [password, setPassword] = useState(demoPassword)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (registerMode) await onRegister(name.trim(), email.trim(), password)
      else await onLogin(email.trim(), password)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to continue. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-layout" aria-label={registerMode ? 'Create a Teamforge account' : 'Teamforge sign in'}>
        <div className="auth-intro">
          <a className="auth-brand" href="#" aria-label="Teamforge"><span className="brand-mark"><Sparkles size={18} /></span><span>teamforge<span className="brand-period">.</span></span></a>
          <div className="auth-intro-copy">
            <span className="auth-eyebrow"><i /> PROJECTS, BUILT TOGETHER</span>
            <h1>Good work starts with the right people.</h1>
            <p>Bring project briefs and people’s skills together to build more balanced teams.</p>
          </div>
          <div className="auth-intro-foot"><span><ShieldCheck size={15} /> Private team workspace</span><span>TEAMFORGE <i>·</i> 2026</span></div>
        </div>

        <div className="auth-form-panel">
          <div className="auth-form-heading"><span>{registerMode ? 'GET STARTED' : 'WELCOME BACK'}</span><h2>{registerMode ? 'Create your account' : 'Sign in to Teamforge'}</h2><p>{registerMode ? 'Create an account to start forming project teams.' : 'Use your workspace account to continue.'}</p></div>
          <form className="auth-form" onSubmit={submit}>
            {registerMode && <><label className="auth-label" htmlFor="auth-name">Full name</label><div className="auth-input-wrap"><input id="auth-name" type="text" autoComplete="name" maxLength={120} required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></div></>}
            <label className="auth-label" htmlFor="auth-email">Email address</label>
            <div className="auth-input-wrap"><Mail size={16} /><input id="auth-email" type="email" autoComplete={registerMode ? 'email' : 'username'} maxLength={190} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /></div>

            <div className="auth-password-label"><label className="auth-label" htmlFor="auth-password">Password</label></div>
            <div className="auth-input-wrap"><LockKeyhole size={16} /><input id="auth-password" type={showPassword ? 'text' : 'password'} autoComplete={registerMode ? 'new-password' : 'current-password'} minLength={registerMode ? 8 : undefined} maxLength={72} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder={registerMode ? 'At least 8 characters' : 'Enter your password'} /><button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>

            {error && <div className="auth-error" role="alert">{error}</div>}
            <button className="auth-submit" type="submit" disabled={loading}>{loading ? <><span className="spinner" /> {registerMode ? 'Creating account...' : 'Signing in...'}</> : <>{registerMode ? 'Create account' : 'Sign in'} <ArrowRight size={16} /></>}</button>
          </form>

          {registerMode ? <button className="auth-mode-toggle" type="button" onClick={() => { setRegisterMode(false); setError('') }}>Already have an account? Sign in</button> : <><button className="auth-mode-toggle" type="button" onClick={() => { setRegisterMode(true); setEmail(''); setPassword(''); setError('') }}>Create an account</button><div className="demo-access"><div className="demo-access-title"><span>DEMO ACCESS</span><span>LOCAL PREVIEW</span></div><p>Demo account details are prefilled. You can edit them to test invalid-login feedback.</p><div className="demo-credential"><span>Email</span><strong>{demoEmail}</strong></div><div className="demo-credential"><span>Password</span><strong>{demoPassword}</strong></div></div><p className="auth-help">Having trouble? Check that the Spring Boot API is running.</p></>}
        </div>
      </section>
    </main>
  )
}

export default LoginPage