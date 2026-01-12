import type { Translate } from '../i18n/translations'

type HireConfirmModalProps = {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  t: Translate
}

const HireConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  t,
}: HireConfirmModalProps) => {
  if (!isOpen) {
    return null
  }

  return (
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
          <button className="modal-primary" type="button" onClick={onConfirm}>
            {t('hireConfirmAction')}
          </button>
          <button className="modal-secondary" type="button" onClick={onCancel}>
            {t('hireCancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HireConfirmModal
