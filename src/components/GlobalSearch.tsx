import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { exercises } from '../lib/program';
import { articles } from '../data/articles';
export function GlobalSearch() {
  const { t, local } = useI18n(),
    [query, setQuery] = useState('');
  const needle = query.normalize('NFKC').trim().toLocaleLowerCase(),
    matches = needle.length > 1;
  return (
    <details className="global-search">
      <summary>{t('globalSearch')}</summary>
      <label className="search-field">
        <input
          type="search"
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
              <Link key={ex.id} to={'/library?exercise=' + ex.id}>
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
              <Link key={article.id} to={'/reference?q=' + encodeURIComponent(query)}>
                {local(article.title)}
              </Link>
            ))}
          <Link to={'/nutrition?q=' + encodeURIComponent(query)}>
            {t('searchFood')}: {query}
          </Link>
        </div>
      )}
    </details>
  );
}
