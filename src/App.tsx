import { useEffect, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Command, Layers3, LogOut, Plus, Search, Settings2, Sparkles, Users, WandSparkles, X } from 'lucide-react'
import LoginPage from './LoginPage'

type Member = {
  id: string
  name: string
  role: string
  department: string
  skills: string[]
  experienceYears: number
  availability: string
  color: string
}

type MatchedMember = { member: Member; matchScore: number; matchedSkills: string[] }
type Recommendation = { members: MatchedMember[]; coveredSkills: string[]; missingSkills: string[]; coverage: number; averageMatch: number }
type AuthUser = { email: string; name: string; role: string }

const rawApiUrl = import.meta.env.VITE_API_URL || '/api'
const apiUrl = rawApiUrl.replace(/\/+$/, '')
const suggestedSkills = ['React', 'Spring Boot', 'User research', 'Python', 'UI/UX', 'PostgreSQL', 'Machine learning', 'Product strategy']
const starterSkills = ['React', 'Spring Boot', 'UI/UX', 'Product strategy']

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2)
}

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [authChecking, setAuthChecking] = useState(true)
  const [projectName, setProjectName] = useState('Customer insight platform')
  const [description, setDescription] = useState('Build a research-led platform that turns customer feedback into clear product opportunities.')
  const [skills, setSkills] = useState<string[]>(starterSkills)
  const [skillInput, setSkillInput] = useState('')
  const [teamSize, setTeamSize] = useState(4)
  const [members, setMembers] = useState<Member[]>([])
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    fetch(`${apiUrl}/auth/me`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) return null
        return await response.json() as { user: AuthUser }
      })
      .then((result) => { if (active && result) setAuthUser(result.user) })
      .catch(() => undefined)
      .finally(() => { if (active) setAuthChecking(false) })
    return () => { active = false }
  }, [])

  async function handleLogin(email: string, password: string) {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const result = await response.json().catch(() => null) as { user?: AuthUser; message?: string } | null
    if (!response.ok || !result?.user) throw new Error(result?.message || 'Sign-in failed. Please try again.')
    setAuthUser(result.user)
  }

  async function handleRegister(name: string, email: string, password: string) {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const result = await response.json().catch(() => null) as { user?: AuthUser; message?: string } | null
    if (!response.ok || !result?.user) throw new Error(result?.message || 'Account creation failed. Please try again.')
    setAuthUser(result.user)
  }

  async function handleLogout() {
    try {
      await fetch(`${apiUrl}/auth/logout`, { method: 'POST', credentials: 'include' })
    } finally {
      setAuthUser(null)
      setRecommendation(null)
    }
  }

  async function getRecommendation(currentSkills = skills) {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${apiUrl}/projects/recommend`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, description, requiredSkills: currentSkills, teamSize, priority: 'balanced' }),
      })
      if (!response.ok) throw new Error('The team matching request could not be completed.')
      setRecommendation(await response.json() as Recommendation)
    } catch {
      setError('Could not reach the matching API. Start the Spring Boot backend on port 8081 and try again.')
    } finally {
      setLoading(false)
      setReady(true)
    }
  }

  useEffect(() => {
    if (!authUser) return
    let active = true
    fetch(`${apiUrl}/members`, { credentials: 'include' })
      .then((response) => {
        if (!response.ok) throw new Error('Member request failed')
        return response.json() as Promise<Member[]>
      })
      .then((data) => { if (active) setMembers(data) })
      .catch(() => { if (active) setError('Start the Spring Boot backend to load the team directory and matching results.') })
    return () => { active = false }
  }, [authUser])

  function addSkill(value = skillInput) {
    const skill = value.trim()
    if (skill && !skills.some((item) => item.toLowerCase() === skill.toLowerCase())) setSkills([...skills, skill])
    setSkillInput('')
  }

  function handleSkillKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addSkill()
    }
  }

  const availabilityCount = members.filter((member) => member.availability === 'Available').length
  const displayName = authUser?.email.split('@')[0].replace(/[._-]/g, ' ') ?? ''

  if (authChecking) {
    return <div className="auth-checking" role="status">Checking your session...</div>
  }

  if (!authUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#workspace" aria-label="Teamforge home"><span className="brand-mark"><Command size={18} strokeWidth={2.4} /></span><span>teamforge<span className="brand-period">.</span></span></a>
        <div className="workspace-switch"><span className="workspace-avatar">N</span><span className="workspace-copy"><strong>Northstar Studio</strong><small>Workspace</small></span><ChevronDown size={15} /></div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#workspace"><Layers3 size={17} />Projects<span className="nav-count">04</span></a>
          <a className="nav-item" href="#people"><Users size={17} />People<span className="nav-count">{members.length || '—'}</span></a>
          <a className="nav-item" href="#activity"><Activity size={17} />Insights</a>
        </nav>
        <div className="sidebar-bottom"><div className="upgrade-note"><div className="upgrade-icon"><Sparkles size={15} /></div><strong>Better teams, by design.</strong><span>Match the right mix of skills to every brief.</span><a href="#project-form">Create a project <ArrowUpRight size={13} /></a></div><button className="profile-button" onClick={handleLogout} aria-label="Sign out"><span className="profile-avatar">{initials(authUser.name || displayName || authUser.email)}</span><span className="profile-copy"><strong>{authUser.name || displayName}</strong><small>{authUser.role}</small></span><LogOut size={16} /></button></div>
      </aside>

      <main className="main-content" id="workspace">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> Projects <span>/</span> <strong>New project</strong></div><div className="top-actions"><button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button><span className="top-divider" /><span className="today-label">MON, OCT 12</span></div></header>
        <div className="page-wrap">
          <section className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> TEAM PLANNING</div><h1>Build your project team</h1><p>Give your brief the right mix of skills, experience, and perspective.</p></div><button className="draft-button"><span className="draft-dot" /> Draft <ChevronDown size={14} /></button></section>
          <section className="metrics-row" aria-label="Workspace metrics">
            <div className="metric"><span className="metric-icon mint"><Layers3 size={17} /></span><div><span className="metric-label">ACTIVE PROJECTS</span><strong>04</strong></div><span className="metric-change positive"><ArrowUpRight size={13} /> 2 this month</span></div>
            <div className="metric"><span className="metric-icon peach"><Users size={17} /></span><div><span className="metric-label">AVAILABLE PEOPLE</span><strong>{members.length ? String(availabilityCount).padStart(2, '0') : '--'}</strong></div><span className="metric-change neutral">Across 5 disciplines</span></div>
            <div className="metric"><span className="metric-icon lavender"><WandSparkles size={17} /></span><div><span className="metric-label">AVG. SKILL COVERAGE</span><strong>86<span className="metric-percent">%</span></strong></div><span className="metric-change positive"><ArrowUpRight size={13} /> +8% this quarter</span></div>
          </section>

          <div className="content-grid">
            <section className="brief-panel" id="project-form">
              <div className="section-heading"><div><div className="section-kicker">01 <span>PROJECT BRIEF</span></div><h2>Start with the essentials</h2></div><span className="required-note"><i /> Required</span></div>
              <label className="field-label" htmlFor="project-name">Project name <span>*</span></label>
              <input id="project-name" className="text-field" value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="e.g. Customer insight platform" />
              <label className="field-label description-label" htmlFor="project-description">What are you building? <span>*</span></label>
              <textarea id="project-description" className="text-field description-field" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A few sentences about the goal and the work involved..." rows={3} />
              <div className="field-header"><label className="field-label" htmlFor="skill-entry">Skills you need <span>*</span></label><span className="field-hint">Add the capabilities this project calls for</span></div>
              <div className="skill-entry-wrap"><Search size={16} /><input id="skill-entry" value={skillInput} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={handleSkillKey} placeholder="Type a skill and press Enter" /><button className="add-skill" onClick={() => addSkill()} aria-label="Add skill"><Plus size={16} /></button></div>
              <div className="selected-skills" aria-label="Selected skills">{skills.map((skill) => <span className="selected-skill" key={skill}>{skill}<button onClick={() => setSkills(skills.filter((item) => item !== skill))} aria-label={`Remove ${skill}`}><X size={12} /></button></span>)}</div>
              <div className="suggestion-row"><span>Try</span>{suggestedSkills.filter((skill) => !skills.some((item) => item.toLowerCase() === skill.toLowerCase())).slice(0, 4).map((skill) => <button key={skill} className="suggestion-chip" onClick={() => addSkill(skill)}><Plus size={11} />{skill}</button>)}</div>
              <div className="form-bottom"><div><label className="field-label" htmlFor="team-size">Team size</label><div className="select-wrap"><Users size={15} /><select id="team-size" value={teamSize} onChange={(event) => setTeamSize(Number(event.target.value))}>{[2, 3, 4, 5, 6, 7, 8].map((size) => <option key={size} value={size}>{size} people</option>)}</select><ChevronDown size={14} /></div></div><div className="priority-box"><span className="field-label">Matching style</span><button className="priority-select">Balanced <ChevronDown size={14} /></button></div></div>
              <div className="form-actions"><span className="secure-note"><Check size={13} /> Your brief stays in your workspace</span><button className="match-button" onClick={() => getRecommendation()} disabled={loading || !projectName.trim() || !description.trim() || skills.length === 0}>{loading ? <><span className="spinner" /> Matching...</> : <><Sparkles size={15} /> Find my team <ArrowDownRight size={15} /></>}</button></div>
              {error && <div className="error-message" role="alert">{error}</div>}
            </section>

            <section className="results-panel" id="people">
              <div className="section-heading results-heading"><div><div className="section-kicker">02 <span>YOUR RECOMMENDATION</span></div><h2>Team composition</h2></div><button className="more-button" aria-label="Recommendation settings"><Settings2 size={17} /></button></div>
              {recommendation ? <>
                <div className="coverage-card"><div className="coverage-copy"><span>SKILL COVERAGE</span><strong>{recommendation.coverage}<small>%</small></strong><p>{recommendation.coveredSkills.length} of {skills.length} skills covered</p></div><div className="coverage-ring" style={{ '--coverage': `${recommendation.coverage}%` } as React.CSSProperties}><div className="ring-inner"><Sparkles size={18} /><span>FIT</span></div></div><div className="coverage-foot"><span><i className="legend-dot covered" /> Covered</span><span><i className="legend-dot missing" /> Missing</span><strong>{recommendation.missingSkills.length ? `${recommendation.missingSkills.length} gap${recommendation.missingSkills.length > 1 ? 's' : ''}` : 'Full coverage'}</strong></div></div>
                <div className="team-list-heading"><div><h3>Recommended team <span>{recommendation.members.length}</span></h3><p>Ranked by skill fit and experience</p></div><button className="sort-button">Best fit <ChevronDown size={13} /></button></div>
                <div className="member-list">{recommendation.members.map(({ member, matchScore, matchedSkills }) => <article className="member-row" key={member.id}><div className={`member-avatar ${member.color}`}>{initials(member.name)}<span className="online-indicator" /></div><div className="member-info"><div className="member-name-line"><strong>{member.name}</strong><span className="member-score">{matchScore}% <small>match</small></span></div><div className="member-meta">{member.role}<span />{member.experienceYears} yrs exp.</div><div className="member-skills">{matchedSkills.length ? matchedSkills.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>) : <span className="no-overlap">Complementary profile</span>}</div></div><button className="member-add" aria-label={`Add ${member.name} to team`}><Plus size={15} /></button></article>)}</div>
                {recommendation.missingSkills.length > 0 && <div className="gap-note"><span className="gap-icon"><Activity size={14} /></span><p><strong>Skill gaps to consider</strong><span>{recommendation.missingSkills.join(', ')}</span></p><button aria-label="Dismiss skill gap notice"><X size={14} /></button></div>}
                <button className="save-team-button"><Check size={15} /> Save team draft</button>
              </> : <div className="empty-results"><div className="empty-illustration"><div className="empty-orbit orbit-one" /><div className="empty-orbit orbit-two" /><span><WandSparkles size={25} /></span></div><h3>{ready ? 'No recommendations yet' : 'Your team starts here'}</h3><p>{ready ? 'Adjust the required skills or team size, then run the match again.' : 'Add your project needs and we’ll find the people whose skills fit best.'}</p><button onClick={() => getRecommendation()} disabled={loading || skills.length === 0} className="empty-cta"><Sparkles size={14} /> Find my team</button></div>}
              <div className="results-footer"><span><span className="live-dot" /> Live skill directory</span><button>How matching works <ArrowUpRight size={12} /></button></div>
            </section>
          </div>
          <footer className="page-footer"><span>TEAMFORGE <i>·</i> PEOPLE FIRST, PROJECT READY</span><span>Made for teams that make things.</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
