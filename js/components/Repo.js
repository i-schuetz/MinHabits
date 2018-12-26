import {
    AsyncStorage
} from 'react-native';

const ITEMS_KEY = 'SIMPLE_HABITS';

export default class Store {

    static loadItems = async () => {
        // let items = null;
        // try {
        //     const jsonItems = await AsyncStorage.getItem(ITEMS_KEY);
        //     items = JSON.parse(jsonItems);
        // } catch (error) {
        //     console.error('Error loading journal items. ', error.message);
        // }
        // return items || [];
        return [
            { name: "Foo" },
            { name: "The store is working!" }
        ]
    }

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
