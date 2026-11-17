import type { ReactNode } from 'react';
import { useI18n } from '../i18n';
export function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <details className="compact-disclosure">
      <summary>{t(label)}</summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
