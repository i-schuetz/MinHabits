import { filterNeedAttentionHabits, retrieveUnfilteredNeedAttentionHabits } from "../../logic/PopupsInternal"
import { meditateHabit, wakeUpWeekdaysHabit, sendPreliminaryTaxes, makeSportHabit } from "../../__tests_deps/ExampleHabits"
import { Month } from "../../models/Month"

describe("Popups internal", () => {
  it("Filters need attention habits", () => {
    expect(filterNeedAttentionHabits([], [])).toEqual([])

    // wakeUpWeekdaysHabit (id 0) is in the waiting list, so it doesn't need attention
    expect(filterNeedAttentionHabits([meditateHabit, wakeUpWeekdaysHabit, sendPreliminaryTaxes], [0])).toEqual([
      meditateHabit,
      sendPreliminaryTaxes
    ])
  })

  it("Retrieve unfiltered habits that need attention", () => {
    // Habit was done only 1/5 -> 20% or lower, so it needs attention
    expect(
      retrieveUnfilteredNeedAttentionHabits(
        [meditateHabit],
        [
          { id: 0, habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } }
        ]
      )
    ).toEqual([meditateHabit])

    // Habit was done 1/4 -> 25%, which is higher than 20%, so it doesn't need attention
    expect(
      retrieveUnfilteredNeedAttentionHabits(
        [meditateHabit],
        [
          { id: 0, habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } }
        ]
      )
    ).toEqual([])

    // Habit was always done -> 100%, which is higher than 20%, so it doesn't need attention
    expect(
      retrieveUnfilteredNeedAttentionHabits(
        [meditateHabit],
        [
          { id: 0, habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019 } }
        ]
      )
    ).toEqual([])

    // Habit was never done -> 0%, which is lower than 20%, so it needs attention
    expect(
      retrieveUnfilteredNeedAttentionHabits(
        [meditateHabit],
        [
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } }
        ]
      )
    ).toEqual([meditateHabit])

    // Habit doesn't have any resolved tasks -> it doesn't need attention
    expect(retrieveUnfilteredNeedAttentionHabits([meditateHabit], [])).toEqual([])

    // No habits and no resolved tasks -> Nothing needs attention.
    expect(retrieveUnfilteredNeedAttentionHabits([meditateHabit], [])).toEqual([])

    // Habit has a single resolved done task -> 100% -> it doesn't need attention
    expect(
      retrieveUnfilteredNeedAttentionHabits(
        [meditateHabit],
        [{ id: 0, habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019 } }]
      )
    ).toEqual([])

    // Habit has a single resolved missed task -> 0% -> it needs attention
    expect(
      retrieveUnfilteredNeedAttentionHabits(
        [meditateHabit],
        [{ id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } }]
      )
    ).toEqual([meditateHabit])

    // Habit referenced by resolved tasks isn't passed -> Invalid state (we pass all existent habits and resolved task has foreign key to habits) -> Error
    expect(() =>
      retrieveUnfilteredNeedAttentionHabits(
        [meditateHabit],
        [{ id: 0, habitId: 123, done: false, date: { day: 1, month: Month.January, year: 2019 } }]
      )
    ).toThrow()

    // Habit referenced by resolved tasks isn't passed -> Invalid state (we pass all existent habits and resolved task has foreign key to habits) -> Error
    // In this variant an additional task is passed which does reference the passed habit.
    expect(() =>
      retrieveUnfilteredNeedAttentionHabits(
        [meditateHabit],
        [
          { id: 0, habitId: 123, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } }
        ]
      )
    ).toThrow()

    // Habit referenced by resolved tasks isn't passed -> Invalid state (we pass all existent habits and resolved task has foreign key to habits) -> Error
    // In this variant the passed habits are empty.
    expect(() =>
      retrieveUnfilteredNeedAttentionHabits(
        [],
        [{ id: 0, habitId: 123, done: false, date: { day: 1, month: Month.January, year: 2019 } }]
      )
    ).toThrow()

    // Multiple habits - Wake up early is done 1/2 -> doesn't need attention, meditate is done 1/6 -> needs attention, sport is done 0/1 -> needs attention.
    expect(
      retrieveUnfilteredNeedAttentionHabits(
        [wakeUpWeekdaysHabit, meditateHabit, makeSportHabit],
        [
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 0, done: true, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 0, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019 } },
          { id: 0, habitId: 1, done: false, date: { day: 1, month: Month.January, year: 2019 } },
        ]
      )
    ).toEqual([meditateHabit, makeSportHabit])
  })
})
