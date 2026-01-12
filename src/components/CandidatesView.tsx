import type { Mserp_hcmcandidatetohireentities } from '../generated/models/Mserp_hcmcandidatetohireentitiesModel'
import type { Translate } from '../i18n/translations'
import type { SortDirection, SortField } from '../types/candidates'

type CandidatesViewProps = {
  t: Translate
  candidates: Mserp_hcmcandidatetohireentities[]
  sortedCandidates: Mserp_hcmcandidatetohireentities[]
  selectedCandidateId: string | null
  selectedCandidate: Mserp_hcmcandidatetohireentities | null
  onSelectCandidate: (id: string) => void
  onRefresh: () => void
  isLoading: boolean
  error: string | null
  isSortMenuOpen: boolean
  onToggleSortMenu: () => void
  onSetSort: (field: SortField, direction: SortDirection) => void
  canHireSelectedCandidate: boolean
  isHiringCandidate: boolean
  isRequestingSignature: boolean
  onRequestSignature: () => void
  onOpenHireConfirm: () => void
  getCandidateName: (candidate: Mserp_hcmcandidatetohireentities) => string
  getCandidateStatus: (candidate: Mserp_hcmcandidatetohireentities) => string
  getFormattedValue: (
    candidate: Mserp_hcmcandidatetohireentities,
    field: string,
  ) => string
  formatDate: (value?: string) => string
}

const CandidatesView = ({
  t,
  candidates,
  sortedCandidates,
  selectedCandidateId,
  selectedCandidate,
  onSelectCandidate,
  onRefresh,
  isLoading,
  error,
  isSortMenuOpen,
  onToggleSortMenu,
  onSetSort,
  canHireSelectedCandidate,
  isHiringCandidate,
  isRequestingSignature,
  onRequestSignature,
  onOpenHireConfirm,
  getCandidateName,
  getCandidateStatus,
  getFormattedValue,
  formatDate,
}: CandidatesViewProps) => (
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
            onClick={onRefresh}
            disabled={isLoading}
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
              onClick={onToggleSortMenu}
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
                  onClick={() => onSetSort('name', 'asc')}
                >
                  {t('sortNameAsc')}
                </button>
                <button
                  className="sort-option"
                  type="button"
                  onClick={() => onSetSort('name', 'desc')}
                >
                  {t('sortNameDesc')}
                </button>
                <button
                  className="sort-option"
                  type="button"
                  onClick={() => onSetSort('status', 'asc')}
                >
                  {t('sortStatusAsc')}
                </button>
                <button
                  className="sort-option"
                  type="button"
                  onClick={() => onSetSort('status', 'desc')}
                >
                  {t('sortStatusDesc')}
                </button>
                <button
                  className="sort-option"
                  type="button"
                  onClick={() => onSetSort('hireDate', 'asc')}
                >
                  {t('sortHireDateAsc')}
                </button>
                <button
                  className="sort-option"
                  type="button"
                  onClick={() => onSetSort('hireDate', 'desc')}
                >
                  {t('sortHireDateDesc')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoading && <p className="status-line">{t('loadingCandidates')}</p>}

      {error && (
        <div className="status-error">
          <p>{t('candidatesError')}</p>
          <button className="candidate-refresh" type="button" onClick={onRefresh}>
            {t('retry')}
          </button>
        </div>
      )}

      {!isLoading && !error && candidates.length === 0 && (
        <p className="status-line">{t('noCandidates')}</p>
      )}

      {!isLoading && !error && candidates.length > 0 && (
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
                    onSelectCandidate(candidate.mserp_hcmcandidatetohireentityid)
                  }
                >
                  <span className="candidate-meta">
                    <span className="candidate-name">{candidateName}</span>
                    <span className="candidate-status">
                      {getCandidateStatus(candidate)}
                    </span>
                  </span>
                  <span className="candidate-date">
                    <span className="candidate-date-label">{t('availableLabel')}:</span>
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
              <div className="candidate-panel-actions">
                <button
                  className="candidate-signature"
                  type="button"
                  onClick={onRequestSignature}
                  disabled={isRequestingSignature || isHiringCandidate}
                >
                  {t('requestSignature')}
                </button>
                <button
                  className="candidate-hire"
                  type="button"
                  onClick={onOpenHireConfirm}
                  disabled={isHiringCandidate || isRequestingSignature}
                >
                  {t('hire')}
                </button>
              </div>
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
                {getFormattedValue(selectedCandidate, 'mserp_isdisabledveteran')}
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
)

export default CandidatesView
