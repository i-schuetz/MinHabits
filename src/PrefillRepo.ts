import { SQLite } from "expo"

export default class PrefillRepo {
  static prefill = (tx: SQLite.Transaction) => {
    tx.executeSql(
      `insert or ignore into habits (id, name, time) values (?, ?, ?)`,
      ["0", "Take a shower", JSON.stringify({
        type: "w",
        value: [0, 1, 2, 3, 4, 5, 6],
        start: "2019-01-01"
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
        start: "2019-01-01"
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
        start: "2019-01-01"
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
        start: "2019-01-01"
      })],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["0", "1", "2018-06-01"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["1", "1", "2018-07-01"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["1", "0", "2018-07-04"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["1", "0", "2018-08-01"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["2", "1", "2018-09-01"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["2", "1", "2018-10-01"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )

    tx.executeSql(
      `insert or ignore into resolved_tasks (habitId, done, date) values (?, ?, ?)`,
      ["3", "0", "2018-11-01"],
      () => {
      },
      ({}, error) => {
        console.log(`Add habit error: ${error}`)
      }
    )
  }
}
