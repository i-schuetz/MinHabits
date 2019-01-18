import { DayDate } from "../DayDate";

/**
 * Identical to ResolvedTask, except that it hasn't been necessarily persisted yet.
 */
export type ResolvedTaskInput = {
  readonly habitId: number;
  readonly done: boolean;
  readonly date: DayDate;
}
