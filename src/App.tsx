import { useEffect, useMemo, useState } from 'react'
import type { User } from './generated/models/Office365UsersModel'
import { Office365UsersService } from './generated/services/Office365UsersService'
import type { Mserp_hcmcandidatetohireentities } from './generated/models/Mserp_hcmcandidatetohireentitiesModel'
import { Mserp_hcmcandidatetohireentitiesmserp_applicantintegrationresult } from './generated/models/Mserp_hcmcandidatetohireentitiesModel'
import { Mserp_hcmcandidatetohireentitiesService } from './generated/services/Mserp_hcmcandidatetohireentitiesService'
import type {
  Clmbus_flowregistrationsesBase,
  Clmbus_flowregistrationsesclmbus_flowtype,
  Clmbus_flowregistrationsesstatecode,
} from './generated/models/Clmbus_flowregistrationsesModel'
import { Clmbus_flowregistrationsesService } from './generated/services/Clmbus_flowregistrationsesService'
import { ensurePowerInit } from './PowerProvider'
import './App.css'

type Locale = 'da' | 'en'
type SortField = 'name' | 'status' | 'hireDate'
type SortDirection = 'asc' | 'desc'

const translations = {
  da: {
    navOverview: 'Overblik',
    navRecruiting: 'Rekrutering',
    navCandidates: 'Kandidater',
    navProcesses: 'Processer',
    navSchools: 'Skoler & uddannelser',
    loadingUser: 'Indlaeser brugerdata...',
    welcomeUser: 'Velkommen, {name}.',
    userLoadError: 'Kunne ikke indlaese brugerdata.',
    retry: 'Forsog igen',
    continue: 'Fortsaet til appen',
    genericUser: 'Bruger',
    mainContentTitle: 'Hovedindhold for {label}',
    mainContentBody:
      'Dette omrade udfyldes senere. Topbaren forbliver synlig, mens indholdet skifter med navigationen ovenfor.',
    candidatesEyebrow: 'Kandidater',
    candidatesTitle: 'Kandidatoversigt',
    refresh: 'Opdater',
    loadingCandidates: 'Henter kandidater...',
    candidatesError: 'Kunne ikke hente kandidater.',
    noCandidates: 'Ingen kandidater fundet.',
    detailsEyebrow: 'Detaljer',
    selectCandidateTitle: 'Vaelg en kandidat',
    selectCandidateBody:
      'Klik paa en kandidat til venstre for at aabne detaljepanelet.',
    unknownCandidate: 'Ukendt kandidat',
    fieldFirstName: 'Fornavn',
    fieldLastName: 'Efternavn',
    fieldMiddleName: 'Mellemnavn',
    fieldPrefix: 'Prefix',
    fieldCandidateId: 'Kandidat-id',
    fieldBirthdate: 'Fodselsdato',
    fieldGender: 'Koen',
    fieldAvailableFrom: 'Ledig fra',
    fieldPosition: 'Stilling',
    fieldRecruitingId: 'Rekrutterings-id',
    fieldDataArea: 'Data area',
    fieldPartyNumber: 'Partynummer',
    fieldPartyType: 'Partytype',
    fieldCitizenship: 'Statsborgerskab',
    fieldRelocate: 'Flytning',
    fieldVeteran: 'Veteran',
    fieldStatus: 'Status',
    fieldComments: 'Kommentarer',
    hire: 'Hire',
    hireConfirmTitle: 'Er du sikker?',
    hireConfirmBody: 'Denne handling kan ikke fortrydes.',
    hireConfirmAction: 'Bekraeft',
    hireCancel: 'Annuller',
    download: 'Download',
    language: 'Sprog',
    menu: 'Menu',
    languageDanish: 'Dansk',
    languageEnglish: 'English',
    sort: 'Sorter',
    sortNameAsc: 'Navn (A-Z)',
    sortNameDesc: 'Navn (Z-A)',
    sortStatusAsc: 'Status (A-Z)',
    sortStatusDesc: 'Status (Z-A)',
    sortHireDateAsc: 'Ansaettelsesdato (stigende)',
    sortHireDateDesc: 'Ansaettelsesdato (faldende)',
    availableLabel: 'Ledig',
    taskBoardTitle: 'Overblik over opgaver',
    taskCandidatesTitle: 'Kandidater der mangler behandling',
    taskCandidatesCount: '{count} kandidater',
    taskCandidatesCta: 'Gaa til kandidater',
    taskPlaceholderTitle1: 'KPI placeholder',
    taskPlaceholderBody1: 'Tilpas KPI her',
    taskPlaceholderTitle2: 'KPI placeholder',
    taskPlaceholderBody2: 'Tilpas KPI her',
  },
  en: {
    navOverview: 'Overview',
    navRecruiting: 'Recruiting',
    navCandidates: 'Candidates',
    navProcesses: 'Processes',
    navSchools: 'Schools & education',
    loadingUser: 'Loading user data...',
    welcomeUser: 'Welcome, {name}.',
    userLoadError: 'Unable to load user data.',
    retry: 'Try again',
    continue: 'Continue to the app',
    genericUser: 'User',
    mainContentTitle: 'Main content for {label}',
    mainContentBody:
      'This area will be filled later. The top bar remains visible while the content changes with the navigation above.',
    candidatesEyebrow: 'Candidates',
    candidatesTitle: 'Candidate overview',
    refresh: 'Refresh',
    loadingCandidates: 'Loading candidates...',
    candidatesError: 'Unable to load candidates.',
    noCandidates: 'No candidates found.',
    detailsEyebrow: 'Details',
    selectCandidateTitle: 'Select a candidate',
    selectCandidateBody:
      'Click a candidate on the left to open the details panel.',
    unknownCandidate: 'Unknown candidate',
    fieldFirstName: 'First name',
    fieldLastName: 'Last name',
    fieldMiddleName: 'Middle name',
    fieldPrefix: 'Prefix',
    fieldCandidateId: 'Candidate id',
    fieldBirthdate: 'Birthdate',
    fieldGender: 'Gender',
    fieldAvailableFrom: 'Available from',
    fieldPosition: 'Position',
    fieldRecruitingId: 'Recruiting id',
    fieldDataArea: 'Data area',
    fieldPartyNumber: 'Party number',
    fieldPartyType: 'Party type',
    fieldCitizenship: 'Citizenship',
    fieldRelocate: 'Relocation',
    fieldVeteran: 'Veteran',
    fieldStatus: 'Status',
    fieldComments: 'Comments',
    hire: 'Hire',
    hireConfirmTitle: 'Are you sure?',
    hireConfirmBody: 'This action cannot be reverted.',
    hireConfirmAction: 'Confirm',
    hireCancel: 'Cancel',
    download: 'Download',
    language: 'Language',
    menu: 'Menu',
    languageDanish: 'Danish',
    languageEnglish: 'English',
    sort: 'Sort',
    sortNameAsc: 'Name (A-Z)',
    sortNameDesc: 'Name (Z-A)',
    sortStatusAsc: 'Status (A-Z)',
    sortStatusDesc: 'Status (Z-A)',
    sortHireDateAsc: 'Hiring date (asc)',
    sortHireDateDesc: 'Hiring date (desc)',
    availableLabel: 'Available',
    taskBoardTitle: 'Task overview',
    taskCandidatesTitle: 'Candidates awaiting processing',
    taskCandidatesCount: '{count} candidates',
    taskCandidatesCta: 'Go to candidates',
    taskPlaceholderTitle1: 'KPI placeholder',
    taskPlaceholderBody1: 'Configure KPI here',
    taskPlaceholderTitle2: 'KPI placeholder',
    taskPlaceholderBody2: 'Configure KPI here',
  },
} as const

function App() {
  const [locale, setLocale] = useState<Locale>('da')
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const t = (
    key: keyof typeof translations.da,
    vars?: Record<string, string>,
  ) => {
    let value: string = translations[locale][key]
    if (vars) {
      Object.entries(vars).forEach(([token, replacement]) => {
        value = value.replace(`{${token}}`, replacement)
      })
    }
    return value
  }

  const navItems = [
    { id: 'klima', label: t('navOverview') },
    { id: 'om-pant', label: t('navRecruiting') },
    { id: 'pantstationer', label: t('navCandidates') },
    { id: 'virksomheder', label: t('navProcesses') },
    { id: 'skoler', label: t('navSchools') },
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
  const [isHiringCandidate, setIsHiringCandidate] = useState(false)
  const [isConfirmingHire, setIsConfirmingHire] = useState(false)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)

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
        const data = result.data ?? []
        setCandidates(data)
        setHasLoadedCandidates(true)
        return data
      } else {
        setCandidates([])
        setCandidatesError(
          result.error?.message ?? 'Unable to load candidates.',
        )
        return []
      }
    } catch (error) {
      setCandidates([])
      setCandidatesError(
        error instanceof Error ? error.message : 'Unable to load candidates.',
      )
      return []
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

  useEffect(() => {
    if (activeId !== 'klima' || hasLoadedCandidates) {
      return
    }
    void loadCandidates()
  }, [activeId, hasLoadedCandidates])

  const canContinue = Boolean(user) && !isLoadingUser && !userError
  const displayName = user?.DisplayName ?? user?.Mail ?? t('genericUser')
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
    return fullName || t('unknownCandidate')
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

  const handleHireCandidate = async () => {
    if (!selectedCandidate || !isNotProcessed(selectedCandidate)) {
      return
    }
    setIsHiringCandidate(true)
    setCandidatesError(null)
    try {
      await ensurePowerInit()
      const flowRegistration: Partial<Clmbus_flowregistrationsesBase> = {
        clmbus_lookupguid: selectedCandidate.mserp_hcmcandidatetohireentityid,
        clmbus_flowtype: 382470000 as Clmbus_flowregistrationsesclmbus_flowtype,
        clmbus_name: `${getCandidateName(selectedCandidate)} - InterviewPrep`,
        statecode: 0 as Clmbus_flowregistrationsesstatecode,
      }
      const flowResult = await Clmbus_flowregistrationsesService.create(
        flowRegistration as Omit<
          Clmbus_flowregistrationsesBase,
          'clmbus_flowregistrationsid'
        >,
      )
      if (!flowResult.success) {
        setCandidatesError(
          flowResult.error?.message ?? 'Unable to create flow registration.',
        )
        return
      }
      const result = await Mserp_hcmcandidatetohireentitiesService.update(
        selectedCandidate.mserp_hcmcandidatetohireentityid,
        {
          mserp_applicantintegrationresult:
            200000001 as Mserp_hcmcandidatetohireentitiesmserp_applicantintegrationresult,
        },
      )
      if (!result.success) {
        setCandidatesError(
          result.error?.message ?? 'Unable to update candidate status.',
        )
      } else {
        await loadCandidates()
      }
    } catch (error) {
      setCandidatesError(
        error instanceof Error
          ? error.message
          : 'Unable to update candidate status.',
      )
    } finally {
      setIsHiringCandidate(false)
    }
  }

  const formatDate = (value?: string): string => {
    if (!value) {
      return '-'
    }
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return '-'
    }
    const day = String(parsed.getUTCDate()).padStart(2, '0')
    const month = String(parsed.getUTCMonth() + 1).padStart(2, '0')
    const year = parsed.getUTCFullYear()
    return `${day}-${month}-${year}`
  }

  const getCandidateStatus = (candidate: Mserp_hcmcandidatetohireentities) =>
    getFormattedValue(candidate, 'mserp_applicantintegrationresult')

  const isNotProcessed = (candidate: Mserp_hcmcandidatetohireentities) => {
    if (candidate.mserp_applicantintegrationresult === 200000000) {
      return true
    }
    if (
      String(candidate.mserp_applicantintegrationresult ?? '') === '200000000'
    ) {
      return true
    }
    return getCandidateStatus(candidate).toLowerCase() === 'notprocessed'
  }

  const notProcessedCandidates = useMemo(
    () => candidates.filter(isNotProcessed),
    [candidates],
  )

  const canHireSelectedCandidate = selectedCandidate
    ? isNotProcessed(selectedCandidate)
    : false

  const topNotProcessedCandidates = useMemo(
    () => notProcessedCandidates.slice(0, 3),
    [notProcessedCandidates],
  )

  const handleGoToCandidates = async () => {
    setActiveId('pantstationer')
    const data = hasLoadedCandidates ? candidates : await loadCandidates()
    const target = data.find(isNotProcessed) ?? data[0]
    if (target) {
      setSelectedCandidateId(target.mserp_hcmcandidatetohireentityid)
    }
  }

  const sortedCandidates = useMemo(() => {
    const list = [...candidates]
    list.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1
      if (sortField === 'name') {
        const aName = `${a.mserp_firstname ?? ''} ${a.mserp_lastname ?? ''}`
          .trim()
          .toLowerCase()
        const bName = `${b.mserp_firstname ?? ''} ${b.mserp_lastname ?? ''}`
          .trim()
          .toLowerCase()
        return aName.localeCompare(bName) * direction
      }
      if (sortField === 'status') {
        const aStatus = getFormattedValue(
          a,
          'mserp_applicantintegrationresult',
        ).toLowerCase()
        const bStatus = getFormattedValue(
          b,
          'mserp_applicantintegrationresult',
        ).toLowerCase()
        return aStatus.localeCompare(bStatus) * direction
      }
      const aDate = a.mserp_availabilitydate
        ? Date.parse(a.mserp_availabilitydate)
        : 0
      const bDate = b.mserp_availabilitydate
        ? Date.parse(b.mserp_availabilitydate)
        : 0
      return (aDate - bDate) * direction
    })
    return list
  }, [candidates, sortDirection, sortField])

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
            {isLoadingUser && t('loadingUser')}
            {!isLoadingUser &&
              user &&
              t('welcomeUser', { name: displayName })}
            {!isLoadingUser && userError && t('userLoadError')}
          </p>
          {userError && (
            <button className="splash-secondary" type="button" onClick={loadUser}>
              {t('retry')}
            </button>
          )}
          <button
            className="splash-primary"
            type="button"
            onClick={() => setHasContinued(true)}
            disabled={!canContinue}
          >
            {t('continue')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          type="button"
          onClick={() => setActiveId('klima')}
          aria-label={t('navOverview')}
        >
          <img
            className="brand-logo"
            src="https://danskretursystem.dk/app/themes/drs_fallback/dist/images/logo_white_fd4f7212.svg"
            alt="Dansk Retur System"
          />
        </button>

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
            <button className="icon-button" type="button" title={t('download')}>
              <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M12 4v9m0 0 4-4m-4 4-4-4M5 19h14" />
              </svg>
            </button>
            <div className="language-switcher">
              <button
                className="icon-button"
                type="button"
                title={t('language')}
                aria-haspopup="menu"
                aria-expanded={isLanguageMenuOpen}
                onClick={() => setIsLanguageMenuOpen((open) => !open)}
              >
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                </svg>
              </button>
              {isLanguageMenuOpen && (
                <div className="language-menu" role="menu">
                  <button
                    className={`language-option${locale === 'da' ? ' is-active' : ''}`}
                    type="button"
                    onClick={() => {
                      setLocale('da')
                      setIsLanguageMenuOpen(false)
                    }}
                  >
                    <span className="language-flag language-flag-da" aria-hidden="true" />
                    {t('languageDanish')}
                  </button>
                  <button
                    className={`language-option${locale === 'en' ? ' is-active' : ''}`}
                    type="button"
                    onClick={() => {
                      setLocale('en')
                      setIsLanguageMenuOpen(false)
                    }}
                  >
                    <span className="language-flag language-flag-en" aria-hidden="true" />
                    {t('languageEnglish')}
                  </button>
                </div>
              )}
            </div>
            <button className="icon-button" type="button" title={t('menu')}>
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
                  <p className="eyebrow">{t('candidatesEyebrow')}</p>
                  <h1>{t('candidatesTitle')}</h1>
                </div>
                <div className="candidate-actions">
                  <button
                    className="candidate-refresh"
                    type="button"
                    onClick={loadCandidates}
                    disabled={isLoadingCandidates}
                  >
                    {t('refresh')}
                  </button>
                  <div className="sort-switcher">
                    <button
                      className="sort-button"
                      type="button"
                      title={t('sort')}
                      aria-haspopup="menu"
                      aria-expanded={isSortMenuOpen}
                      onClick={() => setIsSortMenuOpen((open) => !open)}
                    >
                      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                        <path d="M7 4v13m0 0-3-3m3 3 3-3M17 20V7m0 0-3 3m3-3 3 3" />
                      </svg>
                    </button>
                    {isSortMenuOpen && (
                      <div className="sort-menu" role="menu">
                        <button
                          className="sort-option"
                          type="button"
                          onClick={() => {
                            setSortField('name')
                            setSortDirection('asc')
                            setIsSortMenuOpen(false)
                          }}
                        >
                          {t('sortNameAsc')}
                        </button>
                        <button
                          className="sort-option"
                          type="button"
                          onClick={() => {
                            setSortField('name')
                            setSortDirection('desc')
                            setIsSortMenuOpen(false)
                          }}
                        >
                          {t('sortNameDesc')}
                        </button>
                        <button
                          className="sort-option"
                          type="button"
                          onClick={() => {
                            setSortField('status')
                            setSortDirection('asc')
                            setIsSortMenuOpen(false)
                          }}
                        >
                          {t('sortStatusAsc')}
                        </button>
                        <button
                          className="sort-option"
                          type="button"
                          onClick={() => {
                            setSortField('status')
                            setSortDirection('desc')
                            setIsSortMenuOpen(false)
                          }}
                        >
                          {t('sortStatusDesc')}
                        </button>
                        <button
                          className="sort-option"
                          type="button"
                          onClick={() => {
                            setSortField('hireDate')
                            setSortDirection('asc')
                            setIsSortMenuOpen(false)
                          }}
                        >
                          {t('sortHireDateAsc')}
                        </button>
                        <button
                          className="sort-option"
                          type="button"
                          onClick={() => {
                            setSortField('hireDate')
                            setSortDirection('desc')
                            setIsSortMenuOpen(false)
                          }}
                        >
                          {t('sortHireDateDesc')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isLoadingCandidates && (
                <p className="status-line">{t('loadingCandidates')}</p>
              )}

              {candidatesError && (
                <div className="status-error">
                  <p>{t('candidatesError')}</p>
                  <button
                    className="candidate-refresh"
                    type="button"
                    onClick={loadCandidates}
                  >
                    {t('retry')}
                  </button>
                </div>
              )}

              {!isLoadingCandidates &&
                !candidatesError &&
                candidates.length === 0 && (
                  <p className="status-line">{t('noCandidates')}</p>
                )}

              {!isLoadingCandidates &&
                !candidatesError &&
                candidates.length > 0 && (
                  <ul className="candidate-list">
                    {sortedCandidates.map((candidate) => {
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
                            <span className="candidate-meta">
                              <span className="candidate-name">{candidateName}</span>
                              <span className="candidate-status">
                                {getCandidateStatus(candidate)}
                              </span>
                            </span>
                            <span className="candidate-date">
                              <span className="candidate-date-label">
                                {t('availableLabel')}:
                              </span>
                              <span className="candidate-date-value">
                                {formatDate(candidate.mserp_availabilitydate)}
                              </span>
                            </span>
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
                    <div className="candidate-panel-title">
                      <p className="eyebrow">{t('detailsEyebrow')}</p>
                      <h2>{getCandidateName(selectedCandidate)}</h2>
                    </div>
                    {canHireSelectedCandidate && (
                      <button
                        className="candidate-hire"
                        type="button"
                        onClick={() => setIsConfirmingHire(true)}
                        disabled={isHiringCandidate}
                      >
                        {t('hire')}
                      </button>
                    )}
                  </div>
                  <dl className="candidate-details">
                    <div>
                      <dt>{t('fieldFirstName')}</dt>
                      <dd>{selectedCandidate.mserp_firstname ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldLastName')}</dt>
                      <dd>{selectedCandidate.mserp_lastname ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldMiddleName')}</dt>
                      <dd>{selectedCandidate.mserp_middlename ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldPrefix')}</dt>
                      <dd>{selectedCandidate.mserp_lastnameprefix ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldCandidateId')}</dt>
                      <dd>{selectedCandidate.mserp_candidateid ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldBirthdate')}</dt>
                      <dd>{formatDate(selectedCandidate.mserp_birthdate)}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldGender')}</dt>
                      <dd>{getFormattedValue(selectedCandidate, 'mserp_gender')}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldAvailableFrom')}</dt>
                      <dd>{formatDate(selectedCandidate.mserp_availabilitydate)}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldPosition')}</dt>
                      <dd>{selectedCandidate.mserp_positionid ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldRecruitingId')}</dt>
                      <dd>{selectedCandidate.mserp_recruitingrequestid ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldDataArea')}</dt>
                      <dd>{selectedCandidate.mserp_dataareaid ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldPartyNumber')}</dt>
                      <dd>{selectedCandidate.mserp_partynumber ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldPartyType')}</dt>
                      <dd>{selectedCandidate.mserp_partytype ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldCitizenship')}</dt>
                      <dd>{selectedCandidate.mserp_citizenshipcountrycode ?? '-'}</dd>
                    </div>
                    <div>
                      <dt>{t('fieldRelocate')}</dt>
                      <dd>
                        {getFormattedValue(
                          selectedCandidate,
                          'mserp_iswillingtorelocate',
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>{t('fieldVeteran')}</dt>
                      <dd>
                        {getFormattedValue(
                          selectedCandidate,
                          'mserp_isdisabledveteran',
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>{t('fieldStatus')}</dt>
                      <dd>
                        {getFormattedValue(
                          selectedCandidate,
                          'mserp_applicantintegrationresult',
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>{t('fieldComments')}</dt>
                      <dd>{selectedCandidate.mserp_comments ?? '-'}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="candidate-empty">
                  <p className="eyebrow">{t('detailsEyebrow')}</p>
                  <h2>{t('selectCandidateTitle')}</h2>
                  <p>{t('selectCandidateBody')}</p>
                </div>
              )}
            </aside>
          </section>
        ) : activeId === 'klima' ? (
          <section className="task-board">
            <div className="task-header">
              <p className="eyebrow">{activeItem.label}</p>
              <h1>{t('taskBoardTitle')}</h1>
            </div>
            <div className="task-grid">
              <article className="task-card task-card-candidates">
                <div className="task-card-header">
                  <div>
                    <h2>{t('taskCandidatesTitle')}</h2>
                    <p>
                      {t('taskCandidatesCount', {
                        count: String(notProcessedCandidates.length),
                      })}
                    </p>
                  </div>
                </div>
                {topNotProcessedCandidates.length > 0 ? (
                  <ul className="task-candidate-list">
                    {topNotProcessedCandidates.map((candidate) => (
                      <li
                        key={candidate.mserp_hcmcandidatetohireentityid}
                        className="task-candidate-row"
                      >
                        <div className="task-candidate-meta">
                          <span className="task-candidate-name">
                            {getCandidateName(candidate)}
                          </span>
                          <span className="task-candidate-status">
                            {getCandidateStatus(candidate)}
                          </span>
                        </div>
                        <div className="task-candidate-date">
                          <span className="task-candidate-date-label">
                            {t('availableLabel')}:
                          </span>
                          <span className="task-candidate-date-value">
                            {formatDate(candidate.mserp_availabilitydate)}
                          </span>
                        </div>
                        <button
                          className="task-row-action"
                          type="button"
                          onClick={handleGoToCandidates}
                          aria-label={t('taskCandidatesCta')}
                        >
                          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                            <path d="M5 12h12m0 0-4-4m4 4-4 4" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="task-empty">{t('noCandidates')}</p>
                )}
                <div className="task-card-footer">
                  <button
                    className="task-action"
                    type="button"
                    onClick={handleGoToCandidates}
                  >
                    <span>{t('taskCandidatesCta')}</span>
                    <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                      <path d="M5 12h12m0 0-4-4m4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </article>
              <article className="task-card task-card-placeholder">
                <div>
                  <h2>{t('taskPlaceholderTitle1')}</h2>
                  <p>{t('taskPlaceholderBody1')}</p>
                </div>
              </article>
              <article className="task-card task-card-placeholder">
                <div>
                  <h2>{t('taskPlaceholderTitle2')}</h2>
                  <p>{t('taskPlaceholderBody2')}</p>
                </div>
              </article>
            </div>
          </section>
        ) : (
          <section className="hero">
            <p className="eyebrow">{activeItem.label}</p>
            <h1>{t('mainContentTitle', { label: activeItem.label })}</h1>
            <p>{t('mainContentBody')}</p>
          </section>
        )}
      </main>
      {isConfirmingHire && selectedCandidate && (
        <div className="modal-backdrop" role="presentation">
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hire-modal-title"
          >
            <h3 id="hire-modal-title">{t('hireConfirmTitle')}</h3>
            <p>{t('hireConfirmBody')}</p>
            <div className="modal-actions">
              <button
                className="modal-primary"
                type="button"
                onClick={async () => {
                  setIsConfirmingHire(false)
                  await handleHireCandidate()
                }}
              >
                {t('hireConfirmAction')}
              </button>
              <button
                className="modal-secondary"
                type="button"
                onClick={() => setIsConfirmingHire(false)}
              >
                {t('hireCancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
