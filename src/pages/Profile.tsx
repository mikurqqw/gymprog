import { useStore } from '../lib/store';
import { NewProfileSetup } from '../components/NewProfileSetup';
import ProfileEditor from './ProfileEditor';
export default function Profile() {
  const state = useStore();
  return state.profile && !Object.values(state.profile.strengthAssessment).includes('unknown') ? (
    <ProfileEditor />
  ) : (
    <NewProfileSetup />
  );
}
