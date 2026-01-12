import type { User } from '../generated/models/Office365UsersModel'
import type { Translate } from '../i18n/translations'

type SplashScreenProps = {
  isLoadingUser: boolean
  user: User | null
  userError: string | null
  displayName: string
  canContinue: boolean
  onRetry: () => void
  onContinue: () => void
  t: Translate
}

const SplashScreen = ({
  isLoadingUser,
  user,
  userError,
  displayName,
  canContinue,
  onRetry,
  onContinue,
  t,
}: SplashScreenProps) => (
  <div className="splash-screen">
    <div className="splash-card">
      <img
        className="splash-logo"
        src="https://danskretursystem.dk/app/themes/drs_fallback/dist/images/logo_white_fd4f7212.svg"
        alt="Dansk Retur System"
      />
      <p className="splash-status">
        {isLoadingUser && t('loadingUser')}
        {!isLoadingUser && user && t('welcomeUser', { name: displayName })}
        {!isLoadingUser && userError && t('userLoadError')}
      </p>
      {userError && (
        <button className="splash-secondary" type="button" onClick={onRetry}>
          {t('retry')}
        </button>
      )}
      <button
        className="splash-primary"
        type="button"
        onClick={onContinue}
        disabled={!canContinue}
      >
        {t('continue')}
      </button>
    </div>
  </div>
)

export default SplashScreen
