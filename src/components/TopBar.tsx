import type { Locale, Translate } from '../i18n/translations'

type NavItem = {
  id: string
  label: string
}

type TopBarProps = {
  navItems: NavItem[]
  activeId: string
  locale: Locale
  isLanguageMenuOpen: boolean
  isUserMenuOpen: boolean
  displayName: string
  userTitle: string
  userEmail?: string | null
  onBrandClick: () => void
  onSelectNav: (id: string) => void
  onToggleLanguageMenu: () => void
  onToggleUserMenu: () => void
  onSelectLocale: (locale: Locale) => void
  t: Translate
}

const TopBar = ({
  navItems,
  activeId,
  locale,
  isLanguageMenuOpen,
  isUserMenuOpen,
  displayName,
  userTitle,
  userEmail,
  onBrandClick,
  onSelectNav,
  onToggleLanguageMenu,
  onToggleUserMenu,
  onSelectLocale,
  t,
}: TopBarProps) => (
  <header className="topbar">
    <button
      className="brand"
      type="button"
      onClick={onBrandClick}
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
            onClick={() => onSelectNav(item.id)}
            type="button"
            aria-current={activeId === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="topbar-actions" aria-label="Quick actions">
        <div className="language-switcher">
          <button
            className="icon-button"
            type="button"
            title={t('language')}
            aria-haspopup="menu"
            aria-expanded={isLanguageMenuOpen}
            onClick={onToggleLanguageMenu}
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
                onClick={() => onSelectLocale('da')}
              >
                <span className="language-flag language-flag-da" aria-hidden="true" />
                {t('languageDanish')}
              </button>
              <button
                className={`language-option${locale === 'en' ? ' is-active' : ''}`}
                type="button"
                onClick={() => onSelectLocale('en')}
              >
                <span className="language-flag language-flag-en" aria-hidden="true" />
                {t('languageEnglish')}
              </button>
            </div>
          )}
        </div>
        <div className="user-switcher">
          <button
            className="icon-button"
            type="button"
            title={t('userMenu')}
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            onClick={onToggleUserMenu}
          >
            <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          </button>
          {isUserMenuOpen && (
            <div className="user-menu" role="menu">
              <p className="user-menu-name">{displayName}</p>
              <p className="user-menu-title">{userTitle || t('userTitleFallback')}</p>
              {userEmail && <p className="user-menu-email">{userEmail}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
)

export default TopBar
