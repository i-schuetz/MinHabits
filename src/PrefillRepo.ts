import { SQLite } from "expo"

export default class PrefillRepo {
  static prefill = (tx: SQLite.Transaction) => {
    tx.executeSql(
      `insert or ignore into habits (id, name, time) values (?, ?, ?)`,
      ["0", "Take a shower", JSON.stringify({
        type: "w",
        value: [0, 1, 2, 3, 4, 5, 6],
        start: "01-01-2019"
      })],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into habits (id, name, time) values (?, ?, ?)`,
      ["1", "Meditate", JSON.stringify({
        type: "w",
        value: [0, 1, 2, 3, 4, 5, 6],
        start: "01-01-2019"
      })],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into habits (id, name, time) values (?, ?, ?)`,
      ["2", "Do sports", JSON.stringify({
        type: "w",
        value: [0, 2, 4],
        start: "01-01-2019"
      })],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into habits (id, name, time) values (?, ?, ?)`,
      ["3", "Eat healthy", JSON.stringify({
        type: "w",
        value: [0, 1, 2, 3, 4, 5, 6],
        start: "01-01-2019"
      })],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["0", "1", "01-06-2018"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["1", "1", "01-07-2018"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["1", "0", "04-07-2018"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["1", "0", "01-08-2018"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["2", "1", "01-09-2018"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["2", "1", "01-10-2018"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["3", "0", "01-11-2018"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )
  }
}
