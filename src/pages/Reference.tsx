import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Search } from 'lucide-react';
import { articles } from '../data/articles';
import { ProgramEvidence } from '../components/ProgramEvidence';
import { useI18n } from '../i18n';
import { Card, Empty, PageTitle } from '../components/ui';
export default function Reference(){const {t,local}=useI18n(),[params]=useSearchParams(),[search,setSearch]=useState(params.get('q')??''),[category,setCategory]=useState('all');const found=articles.filter(a=>(category==='all'||a.category===category)&&(local(a.title)+' '+local(a.body)).toLowerCase().includes(search.toLowerCase()));return <><PageTitle title={t('reference')} description={t('scienceNote')}/><label className="search-field"><Search size={18}/><input type="search" aria-label={t('search')} placeholder={t('search')} value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="tabs">{['all',...new Set(articles.map(a=>a.category))].map(key=><button className={key===category?'active':''} onClick={()=>setCategory(key)} key={key}>{t(key)}</button>)}</div><div className="reference-list">{found.map(a=><Card key={a.id}><details><summary><span className="eyebrow">{t(a.category)}</span><h2>{local(a.title)}</h2></summary><div className="markdown reading"><ReactMarkdown>{local(a.body)}</ReactMarkdown></div></details></Card>)}</div>{!found.length&&<Empty title={t('emptySearch')}/>}<ProgramEvidence all/></>;
}
