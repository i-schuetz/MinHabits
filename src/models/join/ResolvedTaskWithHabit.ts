import { ResolvedTask } from "../ResolvedTask";
import { Habit } from "../Habit";

export type ResolvedTaskWithHabit = {
  readonly task: ResolvedTask;
  readonly habit: Habit;
}
