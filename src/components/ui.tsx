import type { ReactNode } from 'react';
import { ArrowUpRight, CircleHelp } from 'lucide-react';
import { useI18n } from '../i18n';
import { displayWeight } from '../lib/formulas';
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className="page-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description &&
          (compact ? (
            <details className="page-help">
              <summary>{t('compactHelp')}</summary>
              <p className="muted">{description}</p>
            </details>
          ) : (
            <p className="muted">{description}</p>
          ))}
      </div>
      {action}
    </div>
  );
}
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={'card ' + className}>{children}</section>;
}
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {hint && (
          <span className="hint" title={hint}>
            <CircleHelp size={14} />
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
export function Num({
  label,
  value,
  onChange,
  min = 0,
  max = 10000,
  step = 1,
  required = true,
}: {
  label: string;
  value: number | undefined;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number | 'any';
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        required={required}
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
      />
    </Field>
  );
}
export function Weight({ value }: { value: number }) {
  const { units, weightUnit } = useI18n();
  return (
    <>
      {displayWeight(value, units)} <small>{weightUnit}</small>
    </>
  );
}
export function Empty({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <ArrowUpRight size={28} />
      <h3>{title}</h3>
      {text && <p className="muted">{text}</p>}
      {action}
    </div>
  );
}
export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
