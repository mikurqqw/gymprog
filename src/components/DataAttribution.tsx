import foods from '../data/food-sources.json';
import fonts from '../data/font-attribution.json';
import dependencies from '../data/dependency-licenses.json';
import { useI18n } from '../i18n';
import { Card } from './ui';
export function DataAttribution(){const {t,local}=useI18n();return <Card><h2>{t('foodSource')}</h2>{foods.map(source=><p key={source.id}><a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">{local(source.title)}</a> · {source.license}<small> · {local(source.attribution)}</small></p>)}<h3>Noto Sans · OFL-1.1</h3><p><a className="text-link" href={fonts.cssSource} target="_blank" rel="noopener noreferrer">Noto Sans</a></p><h3>{t('source')}</h3>{dependencies.map(item=><p className="micro" key={item.name}><a href={item.source} target="_blank" rel="noopener noreferrer">{item.name} {item.version}</a> · {item.license}</p>)}<p className="micro">IronCycle SVG · IronCycle contributors · CC0-1.0</p></Card>;}
