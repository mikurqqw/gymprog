import ru from './ru.json';
import en from './en.json';
import { useStore } from '../lib/store';
import type { Localized } from '../lib/schema';
export function useI18n(){const {language,units}=useStore();const dictionary:Record<string,string>=language==='ru'?ru:en;return {language,units,t:(key:string)=>dictionary[key]??key,local:(value:Localized)=>value[language],locale:language==='ru'?'ru-RU':'en-GB',weightUnit:units==='metric'?dictionary.kg:dictionary.lb};}
