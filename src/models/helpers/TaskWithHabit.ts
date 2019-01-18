import { Habit } from "../Habit";
import { Task } from "./Task";

export type TaskWithHabit = {
  readonly task: Task;
  readonly habit: Habit;
}
