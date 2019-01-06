import { TimeRule } from './TimeRule';

export type Habit = {
  readonly name: string;
  readonly time: TimeRule;
}

export namespace Habit {

  export function toJSON(habit: Habit): any {
    return {
      name: habit.name,
      time: TimeRule.toJSON(habit.time)
    }
  }

  export function parse(json: any): Habit {
    return {
      name: json["name"],
      time: TimeRule.parse(json["time"])
    }
  }
}
