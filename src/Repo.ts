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

const db = SQLite.openDatabase("db.db")

export type ResolvedTaskUnique = {
  habitId: number
  date: DayDate
}

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


  static loadResolvedTasks: (dateFilter: ResolvedTaskDateFilter | null) => Promise<ResolvedTask[]> = async (dateFilter: ResolvedTaskDateFilter | null) => {

    const sign = (dateFilter: ResolvedTaskDateFilter) => {
      switch (dateFilter.type) {
        case ResolvedTaskDateFilterType.MATCH: 
          return "="
        case ResolvedTaskDateFilterType.BEFORE: 
          return "<"
      }
    }

    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        const selectAll = `select * from resolved_tasks`
        const [query, filter] =
          dateFilter === null ? [selectAll, []] : [selectAll + ` where date${sign(dateFilter)}?`, [DayDateHelpers.toJSON(dateFilter.date)]]

        tx.executeSql(
          query,
          filter,
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

  static loadResolvedTasksWithHabits: (date: DayDate | null) => Promise<ResolvedTaskWithHabit[]> = async (
    date: DayDate | null
  ) => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        const selectAll = `select *, resolved_tasks.id as taskId from resolved_tasks join habits on resolved_tasks.habitId = habits.id`
        let [query, filter] =
          date === null ? [selectAll, []] : [selectAll + ` where date=?`, [DayDateHelpers.toJSON(date)]]

        tx.executeSql(
          query,
          filter,
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
                  date: DayDateHelpers.parse(dateString)
                },
                habit: {
                  id: habitId,
                  name: habitName,
                  time: TimeRuleHelpers.parse(JSON.parse(timeString))
                }
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

  static addHabit = async (inputs: EditHabitInputs) => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `insert or replace into habits (name, time) values (?, ?)`,
          [
            inputs.name,
            JSON.stringify(
              TimeRuleHelpers.toJSON({
                value: inputs.timeRuleValue,
                start: inputs.startDate
              })
            )
          ],
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
      date: DayDateHelpers.parse(dateString)
    }
  }

  static toHabit(map: HashMap): Habit {
    const id: number = map["id"]
    const nameString: string = map["name"]
    const timeString: string = map["time"]
    return {
      id: id,
      name: nameString,
      time: TimeRuleHelpers.parse(JSON.parse(timeString))
    }
  }
}

export enum ResolvedTaskDateFilterType {
  BEFORE, MATCH
}

export type ResolvedTaskDateFilter = {
  type: ResolvedTaskDateFilterType
  date: DayDate
}
