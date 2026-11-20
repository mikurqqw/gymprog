import { useState } from 'react';
import { useI18n } from '../i18n';
import { workoutEquipment } from '../lib/equipment';
import { canonical, shown } from '../lib/measurements';
import { update, useStore } from '../lib/store';
import { MeasurementInput } from './MeasurementInput';
import { Field } from './ui';

export function EquipmentSettings({ announce }: { announce: (message: string) => void }) {
  const state = useStore();
  const { t, units, weightUnit, locale } = useI18n();
  const equipment = workoutEquipment(state);
  const format = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const serialized = equipment.plates
    .map((plate) => format.format(shown(plate, units)!))
    .join('; ');
  const [draft, setDraft] = useState<string | null>(null);

  function change(key: 'step' | 'bar', value: number | null) {
    if (
      value === null ||
      !Number.isFinite(value) ||
      value < (key === 'step' ? 0.25 : 0) ||
      value > (key === 'step' ? 10 : 30)
    )
      return;
    update((old) => {
      if (old.units === 'imperial')
        return { imperialEquipment: { ...old.imperialEquipment, [key]: value } };
      if (key === 'bar') return { bar: value };
      return old.profile
        ? { profile: { ...old.profile, step: value } }
        : { draftProfile: { ...old.draftProfile, step: value } };
    });
  }

  function savePlates() {
    if (draft === null) return;
    const separator = draft.includes(';') || !/[, ]/.test(draft) ? /;/ : /,\s+/;
    const plates = draft.split(separator).map((part) => {
      const value = part.trim().replace(',', '.');
      return /^\d+(?:\.\d+)?$/.test(value)
        ? canonical(Number(value), units, 'weight', [0.25, 50])
        : NaN;
    });
    if (
      plates.length > 20 ||
      plates.some((plate) => !Number.isFinite(plate) || plate < 0.25 || plate > 50)
    ) {
      announce(t('invalid'));
      return;
    }
    const unique = [...new Set(plates)];
    update((old) =>
      old.units === 'imperial'
        ? { imperialEquipment: { ...old.imperialEquipment, plates: unique } }
        : { plateSizes: unique },
    );
    setDraft(null);
    announce(t('saved'));
  }

  return (
    <div className="form-grid">
      <MeasurementInput
        label={t('equipmentStep')}
        value={equipment.step}
        limits={[0.25, 10]}
        onChange={(value) => change('step', value)}
      />
      <MeasurementInput
        label={t('bar')}
        value={equipment.bar}
        limits={[0, 30]}
        onChange={(value) => change('bar', value)}
      />
      <Field label={t('plates') + ' (' + weightUnit + ')'}>
        <input
          value={draft ?? serialized}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={savePlates}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
          }}
        />
      </Field>
      <p className="micro muted">{t('equipmentHint')}</p>
    </div>
  );
}
