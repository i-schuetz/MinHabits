import {
    AsyncStorage
} from 'react-native';

const ITEMS_KEY = 'SIMPLE_HABITS';

export default class Repo {

    static loadItems = async () => {
        let items = null;
        try {
            const jsonItems = await AsyncStorage.getItem(ITEMS_KEY);
            items = JSON.parse(jsonItems);
        } catch (error) {
            console.error('Error loading journal items. ', error.message);
        }
        return items || [];
    }

    static addHabit = async habit => {
        try { 
            const habits = await Repo.loadItems();
            // console.log("Loaded habits: " + JSON.stringify(habits));
            habits.push(habit);
            await Repo.saveItems(habits);
        } catch (error) { 
            console.error('Error saving habit.', error.message); 
        } 
    };

    static saveItems = async items => { 
        try { 
            await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items)); 
        } catch (error) { 
            console.error('Error saving journal items.', error.message); 
        } 
    }; 

    static deleteItems = async () => { 
        try { 
            await AsyncStorage.removeItem(ITEMS_KEY); 
        } catch (error) { 
            console.error('Error deleting journal items.', error.message); 
        } 
    };

}
