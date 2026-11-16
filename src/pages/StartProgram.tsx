import { Link,useNavigate,useSearchParams } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useStore,update } from '../lib/store';
import { programOffers } from '../data/programOffers';
import { nextMonday,today } from '../lib/formulas';
import { Card,PageTitle } from '../components/ui';
export default function StartProgram(){const state=useStore(),{t}=useI18n(),[params]=useSearchParams(),navigate=useNavigate(),offer=programOffers.find(item=>item.goal===params.get('program'));return <><PageTitle title={t('sfSetupTitle')} description={t('sfSetupText')}/><Card><h2>{t(offer?.goal??state.profile.goal)}</h2><p>{t('sfRequirementsText')}</p>{state.onboarded?<Link className="button" to={offer?'/builder?program='+offer.goal:'/builder'}>{t('sfConfigure')}</Link>:<button className="button" onClick={()=>{if(offer)update({profile:{...state.profile,goal:offer.goal,start:nextMonday(today()),days:offer.goal==='powerlifting'?3:state.profile.days},customProgram:null});navigate('/profile');}}>{t('sfApplyProgram')}</button>}</Card></>;}
