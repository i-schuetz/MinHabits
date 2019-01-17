import { SQLite, HashMap } from "expo"
import { Habit } from "./models/Habit"
import * as TimeRuleHelpers from "./models/TimeRule"
import * as DayDateHelpers from "./models/DayDate"
import { EditHabitInputs } from "./models/helpers/EditHabitInputs"
import { ResolvedTask } from "./models/ResolvedTask"
import PrefillRepo from './PrefillRepo';

const db = SQLite.openDatabase("db.db")

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
          "create table if not exists tasks (id integer primary key not null, habitId integer, done integer, date text, " +
            "foreign key(habitId) references habits(id));",
          [],
          () => {
            console.log("Create tasks if not exist success")
          },
          ({}, error) => {
            console.log(`Create table error: ${error}`)
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
            const habits: Habit[] = _array.map((map: HashMap) => {
              const id: number = map["id"]
              const nameString: string = map["name"]
              const timeString: string = map["time"]
              return {
                id: id,
                name: nameString,
                time: TimeRuleHelpers.parse(JSON.parse(timeString))
              }
            })
            resolve(habits)
          },
          ({}, error) => {
            console.log(`Loading error: ${error}`)
            reject()
          }
        )
      })
    )
  }

  static loadTasks: () => Promise<ResolvedTask[]> = async () => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `select * from tasks`,
          [],
          (_, { rows: { _array } }) => {
            const tasks: ResolvedTask[] = _array.map((map: HashMap) => {
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
}
