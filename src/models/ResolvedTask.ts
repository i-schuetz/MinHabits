import { DayDate } from "./DayDate";
import * as DayDateHelpers from "../models/DayDate"

// TODO unit tests

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
