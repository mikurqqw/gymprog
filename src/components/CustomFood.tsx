import { useState } from 'react';
import { useI18n } from '../i18n';
import { foodRepository } from '../lib/foodRepository';
import { Field, Num } from './ui';
export function CustomFood() {
  const { t } = useI18n(),
    [name, setName] = useState(''),
    [values, setValues] = useState({ kcal: 100, p: 0, f: 0, c: 0 }),
    [message, setMessage] = useState('');
  return (
    <details>
      <summary>{t('customFood')}</summary>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await foodRepository.save({
              id: 'custom-' + crypto.randomUUID(),
              name: { ru: name.trim(), kk: name.trim(), en: name.trim() },
              aliases: { ru: [], kk: [], en: [] },
              ...values,
              tags: [],
              portions: [{ name: { ru: '100 г', kk: '100 г', en: '100 g' }, grams: 100 }],
              allergens: [],
              vegetarian: false,
              halal: 'verify',
              sourceId: 'user',
              license: 'Private user data',
              estimated: true,
              custom: true,
            });
            setMessage(t('saved'));
            setName('');
          } catch {
            setMessage(t('invalid'));
          }
        }}
      >
        <Field label={t('foodName')}>
          <input
            required
            minLength={1}
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <p>{t('per100')}</p>
        <div className="form-grid">
          {(['kcal', 'p', 'f', 'c'] as const).map((key, i) => (
            <Num
              key={key}
              label={t(['kcal', 'protein', 'fat', 'carbs'][i])}
              value={values[key]}
              max={key === 'kcal' ? 1000 : 100}
              onChange={(value) => setValues({ ...values, [key]: value })}
            />
          ))}
        </div>
        <button className="button" disabled={!name.trim()}>
          {t('save')}
        </button>
        <p role="status">{message}</p>
      </form>
    </details>
  );
}
