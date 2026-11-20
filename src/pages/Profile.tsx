import { useSearchParams } from 'react-router-dom';
import { SavedProfile } from '../components/SavedProfile';
import { useStore } from '../lib/store';
import { NewProfileSetup } from '../components/NewProfileSetup';
import ProfileEditor from './ProfileEditor';
export default function Profile() {
  const state = useStore();
  const [params] = useSearchParams();
  if (state.profile && params.get('advanced') !== '1')
    return (
      <SavedProfile key={params.get('training')} trainingFirst={params.get('training') === '1'} />
    );
  return state.profile && !Object.values(state.profile.strengthAssessment).includes('unknown') ? (
    <ProfileEditor />
  ) : (
    <NewProfileSetup />
  );
}
