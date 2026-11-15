import { DataAttribution } from '../components/DataAttribution';
import { Link,useParams } from 'react-router-dom';
import { useI18n } from '../i18n';
import { legalConfig } from '../config/legal.config';
import { Card,PageTitle } from '../components/ui';
import { LegalFooter } from '../components/LegalFooter';
type Text={ru:string;kk:string;en:string};
type Document={id:string;title:Text;sections:{heading:Text;body:Text}[];sources:{title:string;url:string;checkedOn:string}[];requiresReview:boolean};
const documents=import.meta.glob('../data/legal/*.json',{eager:true,import:'default'}) as Record<string,Document>;
export default function Legal(){const {id='terms'}=useParams(),{t,language}=useI18n(),doc=documents[`../data/legal/${id}.json`];const render=(text:Text)=>text[language].replace(/\{\{(operator\.[\w]+|effectiveDate)\}\}/g,(_,key:string)=>{const value=key==='effectiveDate'?legalConfig.effectiveDate:legalConfig.operator[key.slice(9) as keyof typeof legalConfig.operator];return !value||value.includes('__REQUIRED')?t('pendingOperator'):value;});if(!doc)return <main className="public-page"><PageTitle title="404" description={t('emptySearch')}/><Link className="button" to="/">{t('back')}</Link></main>;return <div className="public-page"><Link to="/" className="text-link">← IronCycle</Link><PageTitle title={render(doc.title)}/><p className="notice warning">{t('legalReview')}</p><article className="legal-content">{doc.sections.map((section,i)=><Card key={i}><h2>{render(section.heading)}</h2>{render(section.body).split('\n').map((paragraph,j)=><p key={j}>{paragraph}</p>)}</Card>)}</article>{doc.sources.length>0&&<Card><h2>{t('source')}</h2>{doc.sources.map(source=><p key={source.url}><a className="text-link" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a><small> · {source.checkedOn}</small></p>)}</Card>}{id==='sources'&&<DataAttribution/>}<LegalFooter/></div>;}
