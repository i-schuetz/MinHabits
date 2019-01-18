import { DayDate } from "./DayDate";
import * as DayDateHelpers from "./DayDate"

// TODO unit tests

/**
 * A resolved task is a task that can be done or missed, i.e. which isn't open anymore.
 * A done resolved task can be in any point of time (past/today/future). The status is resolved when user marks it as done.
 * A missed resolved task is always in the past. Only at the end of the day the tasks are marked (automatically) as missed. 
 */
export type ResolvedTask = {
  readonly id: number;
  readonly habitId: number;
  readonly done: boolean; // true: Did it. False: Didn't do it (missed).
  readonly date: DayDate;
}

export interface ResolvedTaskJSON {
  readonly id: number;
  readonly habitId: number;
  readonly done: boolean;
  readonly date: string;
}

export function toJSON(task: ResolvedTask): ResolvedTaskJSON {
  return {
    id: task.id,
    habitId: task.habitId,
    done: task.done,
    date: DayDateHelpers.toJSON(task.date)
  }
}

export function parse(json: ResolvedTaskJSON): ResolvedTask {
  return {
    id: json.id,
    habitId: json.habitId,
    done: json.done,
    date: DayDateHelpers.parse(json.date)
  }
}
