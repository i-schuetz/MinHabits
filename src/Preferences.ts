import { AsyncStorage } from "react-native"

export enum PreferencesKey {
  SELECTED_DAILY_LIST_DATE = "SELECTED_DAILY_LIST_DATE"
}

export default class Preferences {

  static saveString = async (key: PreferencesKey, value: string) => {
    await AsyncStorage.setItem(key, value)
  }
  static saveBoolean = async (key: PreferencesKey, value: boolean) => {
    await Preferences.saveString(key, value.toString())
  }
  static saveNumber = async (key: PreferencesKey, value: number) => {
    await Preferences.saveString(key, value.toString())
  }
  static saveJSON = async (key: PreferencesKey, value: any) => {
    await Preferences.saveString(key, value)
  }

  static loadString = async(key: PreferencesKey): Promise<string | null> => {
    return await AsyncStorage.getItem(key)
  }

  static loadBoolean = async(key: PreferencesKey): Promise<boolean | null> => {
    const value = await Preferences.loadString(key) 
    if (value === null) { return null }
    return value == "true"
  }

  static loadNumber = async(key: PreferencesKey): Promise<number | null> => {
    const value = await Preferences.loadString(key) 
    if (value === null) { return null }
    return parseFloat(value)
  }

  static loadJSON = async(key: PreferencesKey): Promise<any | null> => {
    const value = await Preferences.loadString(key) 
    if (value === null) { return null }
    return JSON.parse(value)
  }
}
