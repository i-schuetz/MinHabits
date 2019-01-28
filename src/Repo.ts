import { SQLite, HashMap } from "expo"
import { Habit } from "./models/Habit"
import * as TimeRuleHelpers from "./models/TimeRule"
import * as DayDateHelpers from "./models/DayDate"
import { DayDate } from "./models/DayDate"
import { EditHabitInputs } from "./models/helpers/EditHabitInputs"
import { ResolvedTask } from "./models/ResolvedTask"
import PrefillRepo from "./PrefillRepo"
import { ResolvedTaskWithHabit } from "./models/join/ResolvedTaskWithHabit"
import { ResolvedTaskInput } from "./models/helpers/ResolvedTaskInput"
import { WaitingNeedAttentionHabit } from "./models/WaitingNeedAttentionHabit"

const db = SQLite.openDatabase("db.db")

export type ResolvedTaskUnique = {
  habitId: number
  date: DayDate
}

// TODO cascade delete (habit -> resolved tasks and habit -> habits_attention_waiting)

export default class Repo {
  static init = () => {
    return new Promise((resolve, reject) => {
      console.log("Initializing db")
      return db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          "create table if not exists habits (id integer primary key not null, name text unique, time text);",
          [],
          () => {
            console.log("Create habits if not exist success")
          },
          ({}, error) => {
            console.log(`Create table error: ${error}`)
          }
        )
        tx.executeSql(
          "create table if not exists resolved_tasks (id integer primary key not null, habitId integer, done integer, date text, " +
            "foreign key(habitId) references habits(id), " +
            "unique (habitId, date) on conflict replace" +
            ");",
          [],
          () => {
            console.log("Create resolved_tasks if not exist success")
          },
          ({}, error) => {
            console.log(`Create table error: ${error}`)
          }
        )
        tx.executeSql(
          "create table if not exists habits_attention_waiting (habitId integer primary key not null, date text);",
          [],
          () => {
            console.log("Create habits_attention_waiting if not exist success")
          },
          ({}, error) => {
            console.log(`Create table error: ${error}`)
          }
        )
        tx.executeSql(
          "create index if not exists tasks_date_index ON resolved_tasks (date);",
          [],
          () => {
            console.log("Create tasks_date_index success")
          },
          ({}, error) => {
            console.log(`Create index error: ${error}`)
          }
        )
        
        PrefillRepo.prefill(tx)

        resolve()
      })
    })
  }

  static loadHabits: () => Promise<Habit[]> = async () => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `select * from habits`,
          [],
          (_, { rows: { _array } }) => {
            // console.log(`Loaded habits from db: ${JSON.stringify(_array)}`)
            resolve(_array.map((map: HashMap) => Repo.toHabit(map)))
          },
          ({}, error) => {
            console.log(`Loading error: ${error}`)
            reject()
          }
        )
      })
    )
  }

  static loadHabitsAttentionWaiting: () => Promise<WaitingNeedAttentionHabit[]> = async () => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `select * from habits_attention_waiting`,
          [],
          (_, { rows: { _array } }) => {
            resolve(
              _array.map((map: HashMap) => {
                const habitId: number = map["habitId"]
                const dateString: string = map["date"]
                return {
                  habitId: habitId,
                  date: DayDateHelpers.parse(dateString),
                }
              })
            )
          },
          ({}, error) => {
            console.log(`Loading error: ${error}`)
            reject()
          }
        )
      })
    )
  }

  static addHabitAttentionWaiting = async (habit: WaitingNeedAttentionHabit) => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        Repo.addHabitAttentionWaitingInTransaction(habit, tx, () => resolve(), () => reject())
      })
    )
  }

  private static addHabitAttentionWaitingInTransaction = (
    habit: WaitingNeedAttentionHabit,
    tx: SQLite.Transaction,
    resolve: () => void,
    reject: () => void
  ) => {
    tx.executeSql(
      `insert or replace into habits_attention_waiting (habitId, date) values (?, ?)`,
      [habit.habitId.toString(), DayDateHelpers.toJSON(habit.date)],
      () => {
        console.log(`Added habit id attention waiting: ${habit.habitId}`)
        resolve()
      },
      ({}, error) => {
        console.log(`Add habit id attention waiting error: ${error}`)
        reject()
      }
    )
  }

  static overwriteHabitsAttentionWaiting = async (habits: WaitingNeedAttentionHabit[]) => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        // Delete all entries
        tx.executeSql(
          `delete from habits_attention_waiting`,
          [],
          () => {
            console.log(`Deleted all entries from habits_attention_waiting`)
            resolve()
          },
          ({}, error) => {
            console.log(`Deleting all entries from habits_attention_waiting error: ${error}`)
            reject()
          }
        )

        // Add new entries
        for (const habit of habits) {
          Repo.addHabitAttentionWaitingInTransaction(habit, tx, () => resolve(), () => reject())
        }
      })
    )
  }

  // TODO test (manual)
  static deleteHabits = async (habits: Habit[]) => {
    const habitIds = habits.map(habit => habit.id)
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `delete from habits where (id) in (?)`,
          habitIds,
          () => {
            console.log(`Deleted habits with ids: ${habitIds}`)
            resolve()
          },
          ({}, error) => {
            console.log(`Deleting habits error: ${error}`)
            reject()
          }
        )
      })
    )
  }

  private static generateDateQuery: (dateFilter: ResolvedTaskDateFilter) => [string, string[]] = (
    dateFilter: ResolvedTaskDateFilter
  ) => {
    switch (dateFilter.kind) {
      case "match":
        return [` where date=?`, [DayDateHelpers.toJSON(dateFilter.date)]]
      case "before":
        return [` where date<?`, [DayDateHelpers.toJSON(dateFilter.date)]]
      case "between":
        return [
          ` where date>=? and date<=?`,
          [DayDateHelpers.toJSON(dateFilter.startDate), DayDateHelpers.toJSON(dateFilter.endDate)],
        ]
      case "none":
        return [``, []]
    }
  }

  static loadResolvedTasks: (dateFilter: ResolvedTaskDateFilter) => Promise<ResolvedTask[]> = async (
    dateFilter: ResolvedTaskDateFilter
  ) => {
    const [dateQuery, dateQueryFilters] = Repo.generateDateQuery(dateFilter)

    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        const selectAll = `select * from resolved_tasks`
        tx.executeSql(
          selectAll + dateQuery,
          dateQueryFilters,
          (_, { rows: { _array } }) => {
            resolve(_array.map((map: HashMap) => Repo.toResolvedTask(map)))
          },
          ({}, error) => {
            console.log(`Loading error: ${error}`)
            reject()
          }
        )
      })
    )
  }

  static upsertResolvedTask = async (input: ResolvedTaskInput) => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          // `insert or replace into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
          `insert into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
          [input.habitId.toString(), input.done ? "1" : "0", DayDateHelpers.toJSON(input.date)],
          () => {
            resolve()
          },
          ({}, error) => {
            console.log(`Add habit error: ${error}`)
            reject()
          }
        )
      })
    )
  }

  static removeResolvedTask = async (unique: ResolvedTaskUnique) => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `delete from resolved_tasks where habitId=? and date=?`,
          [unique.habitId.toString(), DayDateHelpers.toJSON(unique.date)],
          () => {
            resolve()
          },
          ({}, error) => {
            console.log(`Add habit error: ${error}`)
            reject()
          }
        )
      })
    )
  }

  static loadResolvedTasksWithHabits: (dateFilter: ResolvedTaskDateFilter) => Promise<ResolvedTaskWithHabit[]> = async (
    dateFilter: ResolvedTaskDateFilter
  ) => {
    const [dateQuery, dateQueryFilters] = Repo.generateDateQuery(dateFilter)

    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        const selectAll = `select *, resolved_tasks.id as taskId from resolved_tasks join habits on resolved_tasks.habitId = habits.id`
        tx.executeSql(
          selectAll + dateQuery,
          dateQueryFilters,
          (_, { rows: { _array } }) => {
            const tasks: ResolvedTaskWithHabit[] = _array.map((map: HashMap) => {
              const taskId: number = map["taskId"]
              const habitId: number = map["habitId"]
              const doneNumber: number = map["done"]
              const dateString: string = map["date"]

              const habitName: string = map["name"]
              const timeString: string = map["time"]

              return {
                task: {
                  id: taskId,
                  habitId: habitId,
                  done: doneNumber == 1 ? true : false,
                  date: DayDateHelpers.parse(dateString),
                },
                habit: {
                  id: habitId,
                  name: habitName,
                  time: TimeRuleHelpers.parse(JSON.parse(timeString)),
                },
              }
            })
            resolve(tasks)
          },
          ({}, error) => {
            console.log(`Loading error: ${error}`)
            reject()
          }
        )
      })
    )
  }

  static upsertHabit = async (inputs: EditHabitInputs) => {
    const pars = [
      inputs.name,
      JSON.stringify(
        TimeRuleHelpers.toJSON({
          value: inputs.timeRuleValue,
          start: inputs.startDate,
        })
      ),
    ]

    const generateQuery = (): [string, string[]] => {
      if (inputs.id === undefined) {
        return [`insert or replace into habits (name, time) values (?, ?)`, pars]
      } else {
        return [`insert or replace into habits (id, name, time) values (?, ?, ?)`, [inputs.id.toString()].concat(pars)]
      }
    }

    const [query, parameters] = generateQuery()

    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          query,
          parameters,
          () => {
            resolve()
          },
          ({}, error) => {
            console.log(`Add habit error: ${error}`)
            reject()
          }
        )
      })
    )
  }

  static toResolvedTask(map: HashMap): ResolvedTask {
    const id: number = map["id"]
    const habitId: number = map["habitId"]
    const doneNumber: number = map["done"]
    const dateString: string = map["date"]

    return {
      id: id,
      habitId: habitId,
      done: doneNumber == 1 ? true : false,
      date: DayDateHelpers.parse(dateString),
    }
  }

  static toHabit(map: HashMap): Habit {
    const id: number = map["id"]
    const nameString: string = map["name"]
    const timeString: string = map["time"]
    return {
      id: id,
      name: nameString,
      time: TimeRuleHelpers.parse(JSON.parse(timeString)),
    }
  }
}

export type ResolvedTaskDateFilter =
  | ResolvedTaskDateFilterBefore
  | ResolvedTaskDateFilterMatch
  | ResolvedTaskDateFilterBetween
  | ResolvedTaskDateFilterNone

export interface ResolvedTaskDateFilterBefore {
  kind: "before"
  date: DayDate
}

export interface ResolvedTaskDateFilterMatch {
  kind: "match"
  date: DayDate
}

export interface ResolvedTaskDateFilterBetween {
  kind: "between"
  startDate: DayDate
  endDate: DayDate
}

export interface ResolvedTaskDateFilterNone {
  kind: "none"
}
