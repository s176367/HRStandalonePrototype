import type { Translate } from '../i18n/translations'

type HeroSectionProps = {
  label: string
  t: Translate
}

const HeroSection = ({ label, t }: HeroSectionProps) => (
  <section className="hero">
    <p className="eyebrow">{label}</p>
    <h1>{t('mainContentTitle', { label })}</h1>
    <p>{t('mainContentBody')}</p>
  </section>
)

export default HeroSection
