import { SQLite, HashMap } from "expo"
import { Habit } from "./models/Habit"
import * as TimeRuleHelpers from "./models/TimeRule"

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
            resolve()
          },
          ({}, error) => {
            console.log(`Create table error: ${error}`)
            reject()
          }
        )
      })
    })
  }

  static loadItems: () => Promise<Habit[]> = async () => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `select * from habits`,
          [],
          (_, { rows: { _array } }) => {
            console.log(`Loaded habits from db: ${JSON.stringify(_array)}`)
            const habits: Habit[] = _array.map((map: HashMap) => {
              const nameString: string = map["name"]
              const timeString: string = map["time"]
              return {
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

  static addHabit = async (habit: Habit) => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `insert or replace into habits (name, time) values (?, ?)`,
          [habit.name, JSON.stringify(TimeRuleHelpers.toJSON(habit.time))],
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
