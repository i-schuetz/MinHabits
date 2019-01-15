import { TimeRule, TimeRuleJSON } from './TimeRule';
import * as TimeRuleHelpers from "./TimeRule"

export type Habit = {
  readonly name: string;
  readonly time: TimeRule;
}

export interface HabitJSON {
  readonly name: string;
  readonly time: TimeRuleJSON;
}

export function toJSON(habit: Habit): HabitJSON {
  return {
    name: habit.name,
    time: TimeRuleHelpers.toJSON(habit.time)
  }
}

export function parse(json: HabitJSON): Habit {
  return {
    name: json["name"],
    time: TimeRuleHelpers.parse(json["time"])
  }
}
