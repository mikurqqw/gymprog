import { get, set } from 'idb-keyval';
export async function saveVideo(id:string,file:File){if(!file.type.startsWith('video/')||file.size>100*1024*1024)throw Error('videoError');await set('video:'+id,file);}
export async function getVideo(id:string){return get<Blob>('video:'+id);}
