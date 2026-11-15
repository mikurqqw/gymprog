import evidence from '../data/program-evidence.json';
import { useI18n } from '../i18n';
import type { Profile } from '../lib/schema';
import { Card } from './ui';
export function ProgramEvidence({goal='powerlifting',all=false}:{goal?:Profile['goal'];all?:boolean}){
 const {t,local}=useI18n(),entries=all?Object.values(evidence).flat():evidence[goal];
 return <Card><h2>{t('science')}</h2><p className="notice">{t('scienceNote')}</p><div className="science-grid">{entries.map((entry,i)=><article key={i}><h3>{local(entry.principle)}</h3><p>{local(entry.application)}</p><p className="micro muted">{local(entry.studyType)} · {t('evidence'+entry.strength)} · {entry.verifiedOn}</p><p className="notice warning">{local(entry.limitation)}</p><a className="text-link" href={entry.source.url} target="_blank" rel="noopener noreferrer">{entry.source.title}</a></article>)}</div><p className="notice">{t('noGuaranteedResults')}</p></Card>;
}
