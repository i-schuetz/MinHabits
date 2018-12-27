var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AsyncStorage } from "react-native";
const ITEMS_KEY = "SIMPLE_HABITS";
// const db = SQLite.openDatabase('db.db');
export default class Repo {
}
Repo.init = () => {
    // return new Promise((resolve, reject) => db.transaction(tx => {
    //   tx.executeSql(
    //     'create table if not exists habits (id integer primary key not null, name text);',
    //     [],
    //     () => resolve(), reject
    //   )
    // }))
};
// static loadItems2 = async () => {
//   return new Promise((resolve, reject) => db.transaction(tx => {
//     tx.executeSql(
//       `select * from habits`,
//       [],
//       (_, { rows: { _array } }) => resolve(rows._array), reject)
//   }))
// }
Repo.loadItems = () => __awaiter(this, void 0, void 0, function* () {
    let items = null;
    try {
        const jsonItems = yield AsyncStorage.getItem(ITEMS_KEY);
        items = JSON.parse(jsonItems);
    }
    catch (error) {
        console.error("Error loading journal items. ", error.message);
    }
    return items || [];
});
Repo.addHabit = (habit) => __awaiter(this, void 0, void 0, function* () {
    try {
        const habits = yield Repo.loadItems();
        // console.log("Loaded habits: " + JSON.stringify(habits));
        habits.push(habit);
        yield Repo.saveItems(habits);
    }
    catch (error) {
        console.error("Error saving habit.", error.message);
    }
});
Repo.saveItems = (items) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    }
    catch (error) {
        console.error("Error saving journal items.", error.message);
    }
});
Repo.deleteItems = () => __awaiter(this, void 0, void 0, function* () {
    try {
        yield AsyncStorage.removeItem(ITEMS_KEY);
    }
    catch (error) {
        console.error("Error deleting journal items.", error.message);
    }
});
//# sourceMappingURL=Repo.js.map