import { useEffect, useState } from 'react'
import './PortfolioTools.css'
const API = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '')).replace(/\/$/, '')
const fields = ['title', 'firstname', 'lastname', 'email', 'completion', 'description']
const emptyRecord = () => Object.fromEntries(fields.map(x => [x, '']))
async function request(path, options = {}, token = '') {
  const res = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`)
  return data
}
export default function PortfolioTools() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('Projects')
  const [user, setUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem('portfolio_user') || 'null') } catch { return null } })
  const [token, setToken] = useState(() => sessionStorage.getItem('portfolio_token') || '')
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' })
  const [record, setRecord] = useState(emptyRecord)
  const [editing, setEditing] = useState('')
  const [items, setItems] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const admin = user?.role === 'admin'
  const section = tab === 'Projects' ? 'projects' : tab === 'Education' ? 'qualifications' : 'contacts'
  const load = async () => {
    if (!['Projects','Education','Contacts'].includes(tab)) return
    if (tab === 'Contacts' && !admin) { setItems([]); return }
    setLoading(true)
    try { setItems(await request(`/api/${section}`, {}, token)); setMessage('') }
    catch (e) { setMessage(e.message); setItems([]) }
    finally { setLoading(false) }
  }
  useEffect(() => { if (open) load() }, [open, tab, token, user?.role]) // eslint-disable-line react-hooks/exhaustive-deps
  const auth = async (kind) => {
    setMessage('')
    try {
      const data = await request(`/api/users/${kind}`, { method: 'POST', body: JSON.stringify(credentials) })
      sessionStorage.setItem('portfolio_token', data.token)
      sessionStorage.setItem('portfolio_user', JSON.stringify(data.user))
      setToken(data.token); setUser(data.user); setCredentials({ name: '', email: '', password: '' })
      setMessage(`Welcome, ${data.user.name}!`); setTab('Projects')
    } catch (e) { setMessage(e.message) }
  }
  const logout = () => { sessionStorage.removeItem('portfolio_token'); sessionStorage.removeItem('portfolio_user'); setToken(''); setUser(null); setMessage('Signed out'); setTab('Signin') }
  const save = async (e) => {
    e.preventDefault(); setMessage('')
    try {
      await request(`/api/${section}${editing ? `/${editing}` : ''}`, { method: editing ? 'PUT' : 'POST', body: JSON.stringify(record) }, token)
      setRecord(emptyRecord()); setEditing(''); setMessage('Saved successfully'); await load()
    } catch (err) { setMessage(err.message) }
  }
  const remove = async (id) => {
    if (!window.confirm('Delete this record?')) return
    try { await request(`/api/${section}/${id}`, { method: 'DELETE' }, token); setMessage('Deleted successfully'); await load() }
    catch (e) { setMessage(e.message) }
  }
  const edit = (item) => { setEditing(item._id); setRecord(Object.fromEntries(fields.map(f => [f, f === 'completion' ? String(item[f] || '').slice(0, 10) : String(item[f] || '')]))); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return <>
    <button className="pt-launch" onClick={() => setOpen(v => !v)} aria-expanded={open}>{open ? 'Close portal' : 'Portfolio portal'}</button>
    {open && <div className="pt-overlay"><section className="pt-panel" aria-label="Portfolio management">
      <header><h2>Portfolio Portal</h2><button onClick={() => setOpen(false)}>✕</button></header>
      <nav>{['Projects','Education', ...(admin ? ['Contacts'] : []), ...(user ? [] : ['Signup','Signin'])].map(t => <button className={tab === t ? 'selected' : ''} key={t} onClick={() => { setTab(t); setMessage(''); setEditing(''); setRecord(emptyRecord()) }}>{t}</button>)}{user && <button onClick={logout}>Signout ({user.name})</button>}</nav>
      {message && <p role="status" className="pt-message">{message}</p>}
      {(tab === 'Signup' || tab === 'Signin') && <form onSubmit={e => { e.preventDefault(); auth(tab === 'Signup' ? 'register' : 'signin') }}>
        <h3>{tab}</h3>{tab === 'Signup' && <label>Name<input required value={credentials.name} onChange={e => setCredentials({ ...credentials, name: e.target.value })}/></label>}
        <label>Email<input type="email" required value={credentials.email} onChange={e => setCredentials({ ...credentials, email: e.target.value })}/></label>
        <label>Password<input type="password" required minLength={8} value={credentials.password} onChange={e => setCredentials({ ...credentials, password: e.target.value })}/></label>
        <button type="submit">{tab}</button>
      </form>}
      {['Projects','Education','Contacts'].includes(tab) && <>
        <h3>{tab} {loading ? '— loading...' : `(${items.length})`}</h3>
        {admin && tab !== 'Contacts' && <form onSubmit={save} className="pt-form"><h4>{editing ? 'Edit' : 'Add'} {tab === 'Projects' ? 'Project' : 'Qualification'}</h4>
          {fields.map(f => <label key={f}>{f === 'completion' ? 'Completion date' : f[0].toUpperCase() + f.slice(1)}{f === 'description' ? <textarea required value={record[f]} onChange={e => setRecord({ ...record, [f]: e.target.value })}/> : <input required type={f === 'email' ? 'email' : f === 'completion' ? 'date' : 'text'} value={record[f]} onChange={e => setRecord({ ...record, [f]: e.target.value })}/>}</label>)}
          <button type="submit">{editing ? 'Update' : 'Create'}</button> {editing && <button type="button" onClick={() => { setEditing(''); setRecord(emptyRecord()) }}>Cancel</button>}
        </form>}
        {tab === 'Contacts' && !admin && <p>Only administrators can view contact submissions.</p>}
        <div className="pt-records">{items.map(item => <article key={item._id}><strong>{item.title || `${item.firstname || ''} ${item.lastname || ''}`}</strong><p>{item.description || item.email}</p>{item.completion && <small>{String(item.completion).slice(0,10)}</small>}{admin && <div>{tab !== 'Contacts' && <button onClick={() => edit(item)}>Edit</button>} <button onClick={() => remove(item._id)}>Delete</button></div>}</article>)}</div>
      </>}
    </section></div>}
  </>
}
