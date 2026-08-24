import { CognitiveProfile } from '../types';
import { NATHAN_PROFILE } from './nathanProfile';
import { STUDENT_PROFILE } from './studentProfile';
import { TRANSITION_PROFILE } from './transitionProfile';

export { NATHAN_PROFILE } from './nathanProfile';
export { STUDENT_PROFILE } from './studentProfile';
export { TRANSITION_PROFILE } from './transitionProfile';

export const INITIAL_COGNITORIUM_PROFILE: CognitiveProfile = NATHAN_PROFILE;

export const PROFILES_PRESETS: { id: string; name: string; tag: string; profile: CognitiveProfile }[] = [
  {
    id: 'nathan',
    name: 'Näthan Cabrol, MS',
    tag: 'Sciences Cognitives (M2) & VRD / Génie Civil',
    profile: NATHAN_PROFILE
  },
  {
    id: 'student',
    name: 'Léa Martin',
    tag: 'Étudiante Master Data Science & IA',
    profile: STUDENT_PROFILE
  },
  {
    id: 'transition',
    name: 'Thomas Valadier',
    tag: 'Reconversion : BTP vers Transition Écologique',
    profile: TRANSITION_PROFILE
  }
];
