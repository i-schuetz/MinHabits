import { DayDate } from "../DayDate";
import { Habit } from "../Habit";

export enum TaskDoneStatus {
  DONE, MISSED, OPEN
}

export type Task = {
  readonly doneStatus: TaskDoneStatus;
  readonly date: DayDate;
  readonly habit: Habit;
}
