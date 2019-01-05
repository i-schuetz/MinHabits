import { SQLite, HashMap } from "expo";
import Habit from "./models/Habit";
import { TimeRule } from "./models/TimeRule";
const db = SQLite.openDatabase("db.db");

export default class Repo {
  
  static init = () => {
    return new Promise((resolve, reject) => {
      console.log("Initializing db");
      return db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          "create table if not exists habits (id integer primary key not null, name text, time text);",
          [],
          () => {
            console.log("Create habits if not exist success");
            resolve();
          },
          ({}, error) => {
            console.log(`Create table error: ${error}`);
            reject();
          }
        );
      })
    });
  };

  static loadItems: () => Promise<Habit[]> = async () => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `select * from habits`,
          [],
          (_, { rows: { _array } }) => {
            console.log(`Loaded habits from db: ${_array}`);

            const habits: Habit[] = _array.map((map: HashMap) => {
              return {
                name: map["name"],
                time: map["time"]
              };
            });
            console.log(`mapped habits: ${habits}`);

            resolve(habits);
          },
          ({}, error) => {
            console.log(`Loading error: ${error}`);
            reject();
          }
        );
      })
    );
  };

  static addHabit = async (habit: Habit) => {
    return new Promise((resolve, reject) =>
      db.transaction((tx: SQLite.Transaction) => {
        tx.executeSql(
          `insert into habits (name, time) values (?, ?)`,
          [habit.name, TimeRule.toString(habit.time)],
          () => {
            resolve();
          },
          ({}, error) => {
            console.log(`Add habit error: ${error}`);
            reject();
          }
        );
      })
    );
  };
}
