import { useEffect, useState } from 'react'
import type { User } from './generated/models/Office365UsersModel'
import { Office365UsersService } from './generated/services/Office365UsersService'
import type { Mserp_hcmcandidatetohireentities } from './generated/models/Mserp_hcmcandidatetohireentitiesModel'
import { Mserp_hcmcandidatetohireentitiesService } from './generated/services/Mserp_hcmcandidatetohireentitiesService'
import { ensurePowerInit } from './PowerProvider'
import './App.css'

function App() {
  const navItems = [
    { id: 'klima', label: 'Overblik' },
    { id: 'om-pant', label: 'Rekrutering' },
    { id: 'pantstationer', label: 'Kandidater' },
    { id: 'virksomheder', label: 'Processer' },
    { id: 'skoler', label: 'Skoler & uddannelser' },
  ]
  const [activeId, setActiveId] = useState(navItems[0].id)
  const activeItem = navItems.find((item) => item.id === activeId) ?? navItems[0]
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)
  const [hasContinued, setHasContinued] = useState(false)
  const [candidates, setCandidates] = useState<Mserp_hcmcandidatetohireentities[]>([])
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false)
  const [candidatesError, setCandidatesError] = useState<string | null>(null)
  const [hasLoadedCandidates, setHasLoadedCandidates] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  )

  const loadUser = async () => {
    setIsLoadingUser(true)
    setUserError(null)
    try {
      await ensurePowerInit()
      const result = await Office365UsersService.MyProfile()
      if (result.success) {
        setUser(result.data)
      } else {
        setUser(null)
        setUserError(result.error?.message ?? 'Unable to load user profile.')
      }
    } catch (error) {
      setUser(null)
      setUserError(
        error instanceof Error ? error.message : 'Unable to load user profile.',
      )
    } finally {
      setIsLoadingUser(false)
    }
  }

  useEffect(() => {
    void loadUser()
  }, [])

  const loadCandidates = async () => {
    setIsLoadingCandidates(true)
    setCandidatesError(null)
    try {
      await ensurePowerInit()
      const result = await Mserp_hcmcandidatetohireentitiesService.getAll({
        maxPageSize: 500,
        select: [
          'mserp_hcmcandidatetohireentityid',
          'mserp_firstname',
          'mserp_lastname',
          'mserp_middlename',
          'mserp_lastnameprefix',
          'mserp_candidateid',
          'mserp_birthdate',
          'mserp_gender',
          'mserp_comments',
          'mserp_positionid',
          'mserp_recruitingrequestid',
          'mserp_citizenshipcountrycode',
          'mserp_dataareaid',
          'mserp_availabilitydate',
          'mserp_iswillingtorelocate',
          'mserp_isdisabledveteran',
          'mserp_applicantintegrationresult',
          'mserp_partynumber',
          'mserp_partytype',
        ],
        orderBy: ['mserp_lastname asc', 'mserp_firstname asc'],
      })
      if (result.success) {
        setCandidates(result.data ?? [])
        setHasLoadedCandidates(true)
      } else {
        setCandidates([])
        setCandidatesError(
          result.error?.message ?? 'Unable to load candidates.',
        )
      }
    } catch (error) {
      setCandidates([])
      setCandidatesError(
        error instanceof Error ? error.message : 'Unable to load candidates.',
      )
    } finally {
      setIsLoadingCandidates(false)
    }
  }

  useEffect(() => {
    if (activeId !== 'pantstationer' || hasLoadedCandidates) {
      return
    }
    void loadCandidates()
  }, [activeId, hasLoadedCandidates])

  const canContinue = Boolean(user) && !isLoadingUser && !userError
  const displayName = user?.DisplayName ?? user?.Mail ?? 'Bruger'
  const selectedCandidate =
    candidates.find(
      (candidate) =>
        candidate.mserp_hcmcandidatetohireentityid === selectedCandidateId,
    ) ?? null

  const getCandidateName = (
    candidate: Mserp_hcmcandidatetohireentities,
  ): string => {
    const firstName = candidate.mserp_firstname?.trim() ?? ''
    const lastName = candidate.mserp_lastname?.trim() ?? ''
    const fullName = [firstName, lastName].filter(Boolean).join(' ')
    return fullName || 'Ukendt kandidat'
  }

  const getFormattedValue = (
    candidate: Mserp_hcmcandidatetohireentities,
    field: string,
  ): string => {
    const formattedKey = `${field}@OData.Community.Display.V1.FormattedValue`
    const formattedValue = (candidate as unknown as Record<string, string | undefined>)[
      formattedKey
    ]
    if (formattedValue) {
      return formattedValue
    }
    const rawValue = (candidate as unknown as Record<string, unknown>)[field]
    if (rawValue === null || rawValue === undefined) {
      return '-'
    }
    return String(rawValue)
  }

  if (!hasContinued) {
    return (
      <div className="splash-screen">
        <div className="splash-card">
          <img
            className="splash-logo"
            src="https://danskretursystem.dk/app/themes/drs_fallback/dist/images/logo_white_fd4f7212.svg"
            alt="Dansk Retur System"
          />
          <p className="splash-status">
            {isLoadingUser && 'Indlaeser brugerdata...'}
            {!isLoadingUser && user && `Velkommen, ${displayName}.`}
            {!isLoadingUser && userError && 'Kunne ikke indlaese brugerdata.'}
          </p>
          {userError && (
            <button className="splash-secondary" type="button" onClick={loadUser}>
              Forsog igen
            </button>
          )}
          <button
            className="splash-primary"
            type="button"
            onClick={() => setHasContinued(true)}
            disabled={!canContinue}
          >
            Fortsaet til appen
          </button>
        </div>
      </div>
    )
  }

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
        {activeId === 'pantstationer' ? (
          <section className="candidates">
            <div className="candidates-list">
              <div className="candidates-header">
                <div>
                  <p className="eyebrow">Kandidater</p>
                  <h1>Kandidatoversigt</h1>
                </div>
                <button
                  className="candidate-refresh"
                  type="button"
                  onClick={loadCandidates}
                  disabled={isLoadingCandidates}
                >
                  Opdater
                </button>
              </div>

              {isLoadingCandidates && (
                <p className="status-line">Henter kandidater...</p>
              )}

              {candidatesError && (
                <div className="status-error">
                  <p>Kunne ikke hente kandidater.</p>
                  <button
                    className="candidate-refresh"
                    type="button"
                    onClick={loadCandidates}
                  >
                    Proev igen
                  </button>
                </div>
              )}

              {!isLoadingCandidates &&
                !candidatesError &&
                candidates.length === 0 && (
                  <p className="status-line">Ingen kandidater fundet.</p>
                )}

              {!isLoadingCandidates &&
                !candidatesError &&
                candidates.length > 0 && (
                  <ul className="candidate-list">
                    {candidates.map((candidate) => {
                      const candidateName = getCandidateName(candidate)
                      return (
                        <li key={candidate.mserp_hcmcandidatetohireentityid}>
                          <button
                            className={`candidate-item${
                              selectedCandidateId ===
                              candidate.mserp_hcmcandidatetohireentityid
                                ? ' is-active'
                                : ''
                            }`}
                            type="button"
                            onClick={() =>
                              setSelectedCandidateId(
                                candidate.mserp_hcmcandidatetohireentityid,
                              )
                            }
                          >
                            {candidateName}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
            </div>

            <aside className="candidate-panel">
              {selectedCandidate ? (
                <div className="candidate-panel-content">
                  <div className="candidate-panel-header">
                    <p className="eyebrow">Detaljer</p>
                    <h2>{getCandidateName(selectedCandidate)}</h2>
                  </div>
                  <dl className="candidate-details">
                    <div>
                      <dt>Fornavn</dt>
                      <dd>{selectedCandidate.mserp_firstname ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Efternavn</dt>
                      <dd>{selectedCandidate.mserp_lastname ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Mellemnavn</dt>
                      <dd>{selectedCandidate.mserp_middlename ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Prefix</dt>
                      <dd>{selectedCandidate.mserp_lastnameprefix ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Kandidat-id</dt>
                      <dd>{selectedCandidate.mserp_candidateid ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Fodselsdato</dt>
                      <dd>{selectedCandidate.mserp_birthdate ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Koen</dt>
                      <dd>{getFormattedValue(selectedCandidate, 'mserp_gender')}</dd>
                    </div>
                    <div>
                      <dt>Ledig fra</dt>
                      <dd>{selectedCandidate.mserp_availabilitydate ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Stilling</dt>
                      <dd>{selectedCandidate.mserp_positionid ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Rekrutterings-id</dt>
                      <dd>{selectedCandidate.mserp_recruitingrequestid ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Data area</dt>
                      <dd>{selectedCandidate.mserp_dataareaid ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Partynummer</dt>
                      <dd>{selectedCandidate.mserp_partynumber ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Partytype</dt>
                      <dd>{selectedCandidate.mserp_partytype ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Statsborgerskab</dt>
                      <dd>{selectedCandidate.mserp_citizenshipcountrycode ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>Flytning</dt>
                      <dd>
                        {getFormattedValue(
                          selectedCandidate,
                          'mserp_iswillingtorelocate',
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Veteran</dt>
                      <dd>
                        {getFormattedValue(
                          selectedCandidate,
                          'mserp_isdisabledveteran',
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>
                        {getFormattedValue(
                          selectedCandidate,
                          'mserp_applicantintegrationresult',
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Kommentarer</dt>
                      <dd>{selectedCandidate.mserp_comments ?? '-'}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="candidate-empty">
                  <p className="eyebrow">Detaljer</p>
                  <h2>Vaelg en kandidat</h2>
                  <p>
                    Klik paa en kandidat til venstre for at aabne
                    detaljepanelet.
                  </p>
                </div>
              )}
            </aside>
          </section>
        ) : (
          <section className="hero">
            <p className="eyebrow">{activeItem.label}</p>
            <h1>Hovedindhold for {activeItem.label}</h1>
            <p>
              Dette omrade udfyldes senere. Topbaren forbliver synlig, mens
              indholdet skifter med navigationen ovenfor.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
