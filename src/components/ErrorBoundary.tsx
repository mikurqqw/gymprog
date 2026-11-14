import { Component, type ReactNode, type ContextType } from 'react';
import ru from '../i18n/ru.json';
import en from '../i18n/en.json';
import { StateContext } from '../lib/store';
export class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 static contextType=StateContext;
 declare context:ContextType<typeof StateContext>;
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){const dictionary=this.context.language==='en'?en:ru;return this.state.failed?<main className="fatal"><h1>{dictionary.errorTitle}</h1><button onClick={()=>window.location.reload()}>{dictionary.reload}</button><p>{dictionary.localOnly}</p></main>:this.props.children;}
}
