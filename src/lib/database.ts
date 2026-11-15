import Dexie,{type Table} from 'dexie';
import { dataAllowed } from './consent';
import type { FoodRecord } from './foodSchema';
export const DATABASE_NAME='IronCycle';
class IronDatabase extends Dexie{
 foods!:Table<FoodRecord,string>;
 favorites!:Table<{foodId:string},string>;
 videos!:Table<{id:string;blob:Blob;type:string;size:number},string>;
 metadata!:Table<{key:string;value:string},string>;
 constructor(){super(DATABASE_NAME);this.version(1).stores({foods:'&id,*searchTokens,sourceId,customFlag',favorites:'&foodId',videos:'&id',metadata:'&key'});}
}
let database:IronDatabase|undefined;
export function getDatabase(){if(!dataAllowed())throw Error('Consent required');database??=new IronDatabase();return database;}
export function closeDatabase(){database?.close();database=undefined;}
