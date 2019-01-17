import { TimeRule, TimeRuleJSON } from './TimeRule';
import * as TimeRuleHelpers from "./TimeRule"

export type Habit = {
  readonly id: number;
  readonly name: string;
  readonly time: TimeRule;
}

export interface HabitJSON {
  readonly id: number;
  readonly name: string;
  readonly time: TimeRuleJSON;
}

export function toJSON(habit: Habit): HabitJSON {
  return {
    id: habit.id,
    name: habit.name,
    time: TimeRuleHelpers.toJSON(habit.time)
  }
}

export function parse(json: HabitJSON): Habit {
  return {
    id: json.id,
    name: json.name,
    time: TimeRuleHelpers.parse(json.time)
  }
}
