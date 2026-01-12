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
import {
  translations,
  type Locale,
  type Translate,
} from './i18n/translations'
import type { SortDirection, SortField } from './types/candidates'
import {
  formatDate,
  getCandidateName,
  getCandidateStatus,
  getFormattedValue,
  isHired,
  isNotProcessed,
} from './utils/candidates'
import CandidatesView from './components/CandidatesView'
import HeroSection from './components/HeroSection'
import HireConfirmModal from './components/HireConfirmModal'
import SplashScreen from './components/SplashScreen'
import TaskBoard from './components/TaskBoard'
import TopBar from './components/TopBar'
import './App.css'

function App() {
  const [locale, setLocale] = useState<Locale>('da')
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const t: Translate = (key, vars) => {
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
  ]
  const [activeId, setActiveId] = useState(navItems[0].id)
  const activeItem = navItems.find((item) => item.id === activeId) ?? navItems[0]
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)
  const [hasContinued, setHasContinued] = useState(false)
  const [candidates, setCandidates] = useState<Mserp_hcmcandidatetohireentities[]>(
    [],
  )
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false)
  const [candidatesError, setCandidatesError] = useState<string | null>(null)
  const [hasLoadedCandidates, setHasLoadedCandidates] = useState(false)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  )
  const [isHiringCandidate, setIsHiringCandidate] = useState(false)
  const [isRequestingSignature, setIsRequestingSignature] = useState(false)
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
        setCandidatesError(result.error?.message ?? 'Unable to load candidates.')
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
      setHasLoadedCandidates(true)
    }
  }

  useEffect(() => {
    if (
      activeId !== 'pantstationer' ||
      hasLoadedCandidates ||
      isLoadingCandidates
    ) {
      return
    }
    void loadCandidates()
  }, [activeId, hasLoadedCandidates, isLoadingCandidates])

  useEffect(() => {
    if (activeId !== 'klima' || hasLoadedCandidates || isLoadingCandidates) {
      return
    }
    void loadCandidates()
  }, [activeId, hasLoadedCandidates, isLoadingCandidates])

  const canContinue = Boolean(user) && !isLoadingUser && !userError
  const displayName = user?.DisplayName ?? user?.Mail ?? t('genericUser')
  const userTitle = user?.JobTitle ?? ''
  const selectedCandidate =
    candidates.find(
      (candidate) =>
        candidate.mserp_hcmcandidatetohireentityid === selectedCandidateId,
    ) ?? null

  const getCandidateDisplayName = (
    candidate: Mserp_hcmcandidatetohireentities,
  ) => getCandidateName(candidate, t('unknownCandidate'))

  const createFlowRegistration = async (
    candidate: Mserp_hcmcandidatetohireentities,
    flowType: Clmbus_flowregistrationsesclmbus_flowtype,
    nameSuffix: string,
  ) => {
    const flowRegistration: Partial<Clmbus_flowregistrationsesBase> = {
      clmbus_lookupguid: candidate.mserp_hcmcandidatetohireentityid,
      clmbus_flowtype: flowType,
      clmbus_name: `${getCandidateDisplayName(candidate)} - ${nameSuffix}`,
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
      return false
    }
    return true
  }

  const handleHireCandidate = async () => {
    if (!selectedCandidate || !isNotProcessed(selectedCandidate)) {
      return
    }
    setIsHiringCandidate(true)
    setCandidatesError(null)
    try {
      await ensurePowerInit()
      const created = await createFlowRegistration(
        selectedCandidate,
        382470000 as Clmbus_flowregistrationsesclmbus_flowtype,
        'InterviewPrep',
      )
      if (!created) {
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

  const handleRequestSignature = async () => {
    if (!selectedCandidate || !isNotProcessed(selectedCandidate)) {
      return
    }
    setIsRequestingSignature(true)
    setCandidatesError(null)
    try {
      await ensurePowerInit()
      const created = await createFlowRegistration(
        selectedCandidate,
        382470002 as Clmbus_flowregistrationsesclmbus_flowtype,
        'SignatureRequired',
      )
      if (created) {
        await loadCandidates()
      }
    } catch (error) {
      setCandidatesError(
        error instanceof Error
          ? error.message
          : 'Unable to create flow registration.',
      )
    } finally {
      setIsRequestingSignature(false)
    }
  }

  const notProcessedCandidates = useMemo(
    () => candidates.filter(isNotProcessed),
    [candidates],
  )

  const hiredCandidates = useMemo(() => candidates.filter(isHired), [candidates])

  const canHireSelectedCandidate = selectedCandidate
    ? isNotProcessed(selectedCandidate)
    : false

  const topNotProcessedCandidates = useMemo(
    () => notProcessedCandidates.slice(0, 3),
    [notProcessedCandidates],
  )
  const topHiredCandidates = useMemo(
    () => hiredCandidates.slice(0, 3),
    [hiredCandidates],
  )

  const handleGoToCandidates = async () => {
    setActiveId('pantstationer')
    const data = hasLoadedCandidates ? candidates : await loadCandidates()
    const target = data.find(isNotProcessed) ?? data[0]
    if (target) {
      setSelectedCandidateId(target.mserp_hcmcandidatetohireentityid)
    }
  }

  const handleGoToCandidate = async (
    candidate: Mserp_hcmcandidatetohireentities,
  ) => {
    setActiveId('pantstationer')
    if (!hasLoadedCandidates) {
      await loadCandidates()
    }
    setSelectedCandidateId(candidate.mserp_hcmcandidatetohireentityid)
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

  const handleToggleLanguageMenu = () => {
    setIsLanguageMenuOpen((open) => !open)
    setIsUserMenuOpen(false)
  }

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen((open) => !open)
    setIsLanguageMenuOpen(false)
  }

  const handleSelectLocale = (nextLocale: Locale) => {
    setLocale(nextLocale)
    setIsLanguageMenuOpen(false)
  }

  const handleSetSort = (field: SortField, direction: SortDirection) => {
    setSortField(field)
    setSortDirection(direction)
    setIsSortMenuOpen(false)
  }

  const handleConfirmHire = async () => {
    setIsConfirmingHire(false)
    await handleHireCandidate()
  }

  if (!hasContinued) {
    return (
      <SplashScreen
        isLoadingUser={isLoadingUser}
        user={user}
        userError={userError}
        displayName={displayName}
        canContinue={canContinue}
        onRetry={loadUser}
        onContinue={() => setHasContinued(true)}
        t={t}
      />
    )
  }

  return (
    <div className="app-shell">
      <TopBar
        navItems={navItems}
        activeId={activeId}
        locale={locale}
        isLanguageMenuOpen={isLanguageMenuOpen}
        isUserMenuOpen={isUserMenuOpen}
        displayName={displayName}
        userTitle={userTitle}
        userEmail={user?.Mail}
        onBrandClick={() => setActiveId('klima')}
        onSelectNav={(id) => setActiveId(id)}
        onToggleLanguageMenu={handleToggleLanguageMenu}
        onToggleUserMenu={handleToggleUserMenu}
        onSelectLocale={handleSelectLocale}
        t={t}
      />

      <main className="page">
        {activeId === 'pantstationer' ? (
          <CandidatesView
            t={t}
            candidates={candidates}
            sortedCandidates={sortedCandidates}
            selectedCandidateId={selectedCandidateId}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={(id) => setSelectedCandidateId(id)}
            onRefresh={loadCandidates}
            isLoading={isLoadingCandidates}
            error={candidatesError}
            isSortMenuOpen={isSortMenuOpen}
            onToggleSortMenu={() => setIsSortMenuOpen((open) => !open)}
            onSetSort={handleSetSort}
            canHireSelectedCandidate={canHireSelectedCandidate}
            isHiringCandidate={isHiringCandidate}
            isRequestingSignature={isRequestingSignature}
            onRequestSignature={handleRequestSignature}
            onOpenHireConfirm={() => setIsConfirmingHire(true)}
            getCandidateName={getCandidateDisplayName}
            getCandidateStatus={getCandidateStatus}
            getFormattedValue={getFormattedValue}
            formatDate={formatDate}
          />
        ) : activeId === 'klima' ? (
          <TaskBoard
            t={t}
            activeLabel={activeItem.label}
            notProcessedCount={notProcessedCandidates.length}
            hiredCount={hiredCandidates.length}
            topNotProcessedCandidates={topNotProcessedCandidates}
            topHiredCandidates={topHiredCandidates}
            onGoToCandidates={handleGoToCandidates}
            onGoToCandidate={handleGoToCandidate}
            getCandidateName={getCandidateDisplayName}
            getCandidateStatus={getCandidateStatus}
            formatDate={formatDate}
          />
        ) : (
          <HeroSection label={activeItem.label} t={t} />
        )}
      </main>
      <HireConfirmModal
        isOpen={isConfirmingHire && Boolean(selectedCandidate)}
        onConfirm={handleConfirmHire}
        onCancel={() => setIsConfirmingHire(false)}
        t={t}
      />
    </div>
  )
}

export default App
