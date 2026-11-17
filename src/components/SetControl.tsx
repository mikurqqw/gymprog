import { Check } from 'lucide-react';
import { useI18n } from '../i18n';
export function SetControl({
  index,
  checked,
  disabled,
  label,
  onClick,
}: {
  index: number;
  checked: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  const { t } = useI18n();
  return (
    <button
      className={'set-control ' + (checked ? 'checked' : '')}
      aria-label={t('focusSet') + ' ' + (index + 1) + ' · ' + label}
      aria-pressed={checked}
      disabled={disabled}
      onClick={onClick}
    >
      <span>
        {t('focusSet')} {index + 1}
      </span>
      {checked && <Check size={18} />}
    </button>
  );
}
