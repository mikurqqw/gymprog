import { useId, useRef, useState } from 'react';
import { CalendarDays, X } from 'lucide-react';
import { useI18n } from '../i18n';
import { today } from '../lib/formulas';
import { birthAge, birthDays } from './birthDate';
export function BirthDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const { t, locale } = useI18n(),
    id = useId(),
    dialog = useRef<HTMLDialogElement>(null);
  const [parts, setParts] = useState(['', '', '']);
  const [year, month, day] = parts,
    currentYear = Number(today().slice(0, 4));
  const candidate = year && month && day ? `${year}-${month}-${day}` : '';
  const valid = birthAge(candidate, today()) !== null;
  const display = (date: string) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(date + 'T12:00:00'),
    );
  const close = () => dialog.current?.close();
  const change = (index: number, next: string) => {
    const updated = parts.map((part, i) => (i === index ? next : part));
    if (Number(updated[2]) > birthDays(updated[0], updated[1])) updated[2] = '';
    setParts(updated);
  };
  return (
    <div className="birth-picker">
      <label className="field" htmlFor={id}>
        <span>{t('birthDate')}</span>
      </label>
      <button
        id={id}
        type="button"
        className="birth-trigger"
        aria-haspopup="dialog"
        onClick={() => {
          setParts(value ? value.split('-') : ['', '', '']);
          dialog.current?.showModal();
        }}
      >
        <span>{value ? display(value) : t('birthChoose')}</span>
        <CalendarDays size={20} />
      </button>
      <dialog
        ref={dialog}
        className="birth-dialog"
        aria-labelledby={id + '-title'}
        aria-describedby={id + '-note'}
      >
        <header>
          <div>
            <p className="eyebrow">IronCycle · 18+</p>
            <h2 id={id + '-title'}>{t('birthChoose')}</h2>
          </div>
          <button type="button" className="icon-button" aria-label={t('close')} onClick={close}>
            <X size={22} />
          </button>
        </header>
        <p id={id + '-note'} className="micro muted">
          {t('birthPrivate')}
        </p>
        <div className="birth-parts">
          {['birthYear', 'birthMonth', 'birthDay'].map((key, index) => (
            <label className="field" key={key}>
              <span>{t(key)}</span>
              <select value={parts[index]} onChange={(event) => change(index, event.target.value)}>
                <option value="">—</option>
                {Array.from(
                  { length: index === 0 ? 121 : index === 1 ? 12 : birthDays(year, month) },
                  (_, i) => {
                    const number = index === 0 ? currentYear - i : i + 1;
                    const option = index === 0 ? String(number) : String(number).padStart(2, '0');
                    return (
                      <option key={option} value={option}>
                        {index === 1
                          ? new Intl.DateTimeFormat(locale, { month: 'long' }).format(
                              new Date(2000, i, 1),
                            )
                          : number}
                      </option>
                    );
                  },
                )}
              </select>
            </label>
          ))}
        </div>
        <p className="birth-preview" aria-live="polite">
          {valid
            ? display(candidate)
            : t(candidate && candidate > today() ? 'birthFuture' : 'birthComplete')}
        </p>
        <div className="birth-actions">
          <button type="button" className="button secondary" onClick={close}>
            {t('birthCancel')}
          </button>
          <button
            type="button"
            className="button"
            disabled={!valid}
            onClick={() => {
              onChange(candidate);
              close();
            }}
          >
            {t('birthApply')}
          </button>
        </div>
      </dialog>
    </div>
  );
}
