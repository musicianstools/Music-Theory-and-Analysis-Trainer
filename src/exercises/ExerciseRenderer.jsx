// Maps an item's `type` to the reusable exercise component.
// To add a new exercise type: build a component taking { item, onComplete(score 0–1) } and register it here.
import { ObjectiveExercise } from './Objective.jsx';
import ScaffoldExercise from './ScaffoldExercise.jsx';
import UpgradeExercise from './UpgradeExercise.jsx';
import ConnectExercise from './ConnectExercise.jsx';
import DirectionExercise from './DirectionExercise.jsx';
import BuilderExercise from './BuilderExercise.jsx';
import ParagraphExercise from './ParagraphExercise.jsx';
import ShortResponseExercise from './ShortResponseExercise.jsx';
import TeeesExercise from './TeeesExercise.jsx';
import SynListExercise from './SynListExercise.jsx';
import { verbsForItem } from '../data/cognitiveVerbs.js';
import TaskVerbs from '../components/TaskVerbs.jsx';

export const EXERCISE_TYPES = {
  mcq: ObjectiveExercise,
  multi: ObjectiveExercise,
  order: ObjectiveExercise,
  match: ObjectiveExercise,
  scaffold: ScaffoldExercise,
  upgrade: UpgradeExercise,
  connect: ConnectExercise,
  direction: DirectionExercise,
  builder: BuilderExercise,
  paragraph: ParagraphExercise,
  short: ShortResponseExercise,
  teees: TeeesExercise,
  synlist: SynListExercise,
};

export default function ExerciseRenderer({ item, onComplete }) {
  const C = EXERCISE_TYPES[item.type];
  if (!C) return <p className="audio-error">Unknown exercise type “{item.type}” (item {item.id}).</p>;
  return (
    <>
      <TaskVerbs verbs={verbsForItem(item)} />
      <C key={item.id} item={item} onComplete={onComplete} />
    </>
  );
}
