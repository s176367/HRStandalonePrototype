import type { Mserp_hcmcandidatetohireentities } from '../generated/models/Mserp_hcmcandidatetohireentitiesModel'
import type { Translate } from '../i18n/translations'

type TaskBoardProps = {
  t: Translate
  activeLabel: string
  notProcessedCount: number
  hiredCount: number
  topNotProcessedCandidates: Mserp_hcmcandidatetohireentities[]
  topHiredCandidates: Mserp_hcmcandidatetohireentities[]
  onGoToCandidates: () => void
  onGoToCandidate: (candidate: Mserp_hcmcandidatetohireentities) => void
  getCandidateName: (candidate: Mserp_hcmcandidatetohireentities) => string
  getCandidateStatus: (candidate: Mserp_hcmcandidatetohireentities) => string
  formatDate: (value?: string) => string
}

const TaskBoard = ({
  t,
  activeLabel,
  notProcessedCount,
  hiredCount,
  topNotProcessedCandidates,
  topHiredCandidates,
  onGoToCandidates,
  onGoToCandidate,
  getCandidateName,
  getCandidateStatus,
  formatDate,
}: TaskBoardProps) => (
  <section className="task-board">
    <div className="task-header">
      <p className="eyebrow">{activeLabel}</p>
      <h1>{t('taskBoardTitle')}</h1>
    </div>
    <div className="task-grid">
      <article className="task-card task-card-candidates">
        <div className="task-card-header">
          <div>
            <h2>{t('taskCandidatesTitle')}</h2>
            <p>{t('taskCandidatesCount', { count: String(notProcessedCount) })}</p>
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
                  onClick={() => onGoToCandidate(candidate)}
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
          <button className="task-action" type="button" onClick={onGoToCandidates}>
            <span>{t('taskCandidatesCta')}</span>
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path d="M5 12h12m0 0-4-4m4 4-4 4" />
            </svg>
          </button>
        </div>
      </article>
      <article className="task-card task-card-hired">
        <div className="task-card-header">
          <div>
            <h2>{t('taskHiredTitle', { count: String(hiredCount) })}</h2>
            <p>{t('taskHiredBody')}</p>
          </div>
        </div>
        {topHiredCandidates.length > 0 ? (
          <ul className="task-candidate-list">
            {topHiredCandidates.map((candidate) => (
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
                  onClick={() => onGoToCandidate(candidate)}
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
      </article>
      <article className="task-card task-card-placeholder">
        <div>
          <h2>{t('taskPlaceholderTitle1')}</h2>
          <p>{t('taskPlaceholderBody1')}</p>
        </div>
      </article>
    </div>
  </section>
)

export default TaskBoard
