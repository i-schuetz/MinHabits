import { DayDate } from "./DayDate";
import * as DayDateHelpers from "../models/DayDate"

// TODO unit test

export type Task = {
  readonly habitId: number;
  readonly done: boolean;
  readonly date: DayDate;
}

export interface TaskJSON {
  readonly habitId: number;
  readonly done: boolean;
  readonly date: string;
}

export function toJSON(task: Task): TaskJSON {
  return {
    habitId: task.habitId,
    done: task.done,
    date: DayDateHelpers.toJSON(task.date)
  }
}

export function parse(json: TaskJSON): Task {
  return {
    habitId: json.habitId,
    done: json.done,
    date: DayDateHelpers.parse(json.date)
  }
}
