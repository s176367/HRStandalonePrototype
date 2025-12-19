import { useState } from 'react'
import './App.css'

function App() {
  const navItems = [
    { id: 'om-pant', label: 'Om pant' },
    { id: 'pantstationer', label: 'Pantstationer' },
    { id: 'virksomheder', label: 'For virksomheder' },
    { id: 'klima', label: 'Klima & miljo' },
    { id: 'skoler', label: 'Skoler & uddannelser' },
  ]
  const [activeId, setActiveId] = useState(navItems[0].id)
  const activeItem = navItems.find((item) => item.id === activeId) ?? navItems[0]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img
            className="brand-logo"
            src="https://danskretursystem.dk/app/themes/drs_fallback/dist/images/logo_white_fd4f7212.svg"
            alt="Dansk Retur System"
          />
        </div>

        <div className="topbar-right">
          <nav className="topnav" aria-label="Primary">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`topnav-link${activeId === item.id ? ' is-active' : ''}`}
                onClick={() => setActiveId(item.id)}
                type="button"
                aria-current={activeId === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="topbar-actions" aria-label="Quick actions">
            <button className="icon-button" type="button" title="Download">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M12 4v9m0 0 4-4m-4 4-4-4M5 19h14" />
              </svg>
            </button>
            <button className="icon-button" type="button" title="Language">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              </svg>
            </button>
            <button className="icon-button" type="button" title="Menu">
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="page">
        <section className="hero">
          <p className="eyebrow">{activeItem.label}</p>
          <h1>Hovedindhold for {activeItem.label}</h1>
          <p>
            Dette omrade udfyldes senere. Topbaren forbliver synlig, mens
            indholdet skifter med navigationen ovenfor.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
