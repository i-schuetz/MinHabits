import { TimeRule, TimeRuleJSON } from './TimeRule';

export type Habit = {
  readonly name: string;
  readonly time: TimeRule;
}

export interface HabitJSON {
  readonly name: string;
  readonly time: TimeRuleJSON;
}

export namespace Habit {

  export function toJSON(habit: Habit): HabitJSON {
    return {
      name: habit.name,
      time: TimeRule.toJSON(habit.time)
    }
  }

  export function parse(json: HabitJSON): Habit {
    return {
      name: json["name"],
      time: TimeRule.parse(json["time"])
    }
  }
}
