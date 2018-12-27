import { AsyncStorage } from "react-native";
// import { SQLite } from 'expo';

const ITEMS_KEY = "SIMPLE_HABITS";
// const db = SQLite.openDatabase('db.db');

export default class Repo {

  static init = () => {
    // return new Promise((resolve, reject) => db.transaction(tx => {
    //   tx.executeSql(
    //     'create table if not exists habits (id integer primary key not null, name text);',
    //     [],
    //     () => resolve(), reject
    //   )
    // }))
  }

  // static loadItems2 = async () => {
  //   return new Promise((resolve, reject) => db.transaction(tx => {
  //     tx.executeSql(
  //       `select * from habits`,
  //       [],
  //       (_, { rows: { _array } }) => resolve(rows._array), reject)
  //   }))
  // }

  static loadItems = async () => {
    let items = null;
    try {
      const jsonItems = await AsyncStorage.getItem(ITEMS_KEY);
      items = JSON.parse(jsonItems);
    } catch (error) {
      console.error("Error loading journal items. ", error.message);
    }
    return items || [];
  };

  static addHabit = async habit => {
    try {
      const habits = await Repo.loadItems();
      // console.log("Loaded habits: " + JSON.stringify(habits));
      habits.push(habit);
      await Repo.saveItems(habits);
    } catch (error) {
      console.error("Error saving habit.", error.message);
    }
  };

  static saveItems = async items => {
    try {
      await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving journal items.", error.message);
    }
  };

  static deleteItems = async () => {
    try {
      await AsyncStorage.removeItem(ITEMS_KEY);
    } catch (error) {
      console.error("Error deleting journal items.", error.message);
    }
  };
}
