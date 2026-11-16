import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { exercises } from '../lib/program';
import { articles } from '../data/articles';
export function GlobalSearch({
  expanded = false,
  onNavigate,
}: {
  expanded?: boolean;
  onNavigate?: () => void;
}) {
  const { t, local } = useI18n(),
    [query, setQuery] = useState('');
  const needle = query.normalize('NFKC').trim().toLocaleLowerCase(),
    matches = needle.length > 1;
  const content = (
    <>
      <label className="search-field">
        <input
          type="search"
          autoFocus={expanded}
          aria-label={t('globalSearch')}
          placeholder={t('searchHint')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      {matches && (
        <div className="search-results">
          {exercises
            .filter((ex) =>
              Object.values(ex.name).some((name) => name.toLocaleLowerCase().includes(needle)),
            )
            .slice(0, 5)
            .map((ex) => (
              <Link onClick={onNavigate} key={ex.id} to={'/library?exercise=' + ex.id}>
                {local(ex.name)}
              </Link>
            ))}
          {articles
            .filter((article) =>
              Object.values(article.title).some((title) =>
                title.toLocaleLowerCase().includes(needle),
              ),
            )
            .slice(0, 3)
            .map((article) => (
              <Link
                onClick={onNavigate}
                key={article.id}
                to={'/reference?q=' + encodeURIComponent(query)}
              >
                {local(article.title)}
              </Link>
            ))}
          <Link onClick={onNavigate} to={'/nutrition?q=' + encodeURIComponent(query)}>
            {t('searchFood')}: {query}
          </Link>
        </div>
      )}
    </>
  );
  return expanded ? (
    <section className="global-search expanded">
      {content}
      {!matches && <p className="muted">{t('searchPrompt')}</p>}
    </section>
  ) : (
    <details className="global-search">
      <summary>{t('globalSearch')}</summary>
      {content}
    </details>
  );
}
