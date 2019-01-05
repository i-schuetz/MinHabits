import { TimeRule } from './TimeRule';

export default interface Habit {
  readonly name: string;
  readonly time: TimeRule;
}
