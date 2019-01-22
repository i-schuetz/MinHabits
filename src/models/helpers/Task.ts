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

export function toBoolean(doneOrMissedStatus: TaskDoneStatus.DONE | TaskDoneStatus.MISSED): boolean {
  return doneOrMissedStatus == TaskDoneStatus.DONE ? true : false
}

export function toDoneStatus(done: boolean): TaskDoneStatus {
  if (done) {
    return TaskDoneStatus.DONE
  } else {
    return TaskDoneStatus.MISSED
  }
}
