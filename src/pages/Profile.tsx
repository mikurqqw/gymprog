import { useStore } from '../lib/store';
import { NewProfileSetup } from '../components/NewProfileSetup';
import ProfileEditor from './ProfileEditor';
export default function Profile() {
  const state = useStore();
  return state.profile ? <ProfileEditor /> : <NewProfileSetup />;
}
