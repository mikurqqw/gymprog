import type { ReactNode } from 'react';
import { useI18n } from '../i18n';
export function Disclosure({
  label,
  children,
  title,
}: {
  label: string;
  children: ReactNode;
  title?: string;
}) {
  const { t } = useI18n();
  return (
    <details className="compact-disclosure">
      <summary>{title ?? t(label)}</summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
