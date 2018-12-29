import React from "react";
import { StyleSheet, View } from "react-native";
import DailyHabitsList from "./components/DailyHabitsList";

export default class App extends React.Component<any, any> {

  render() {
    return (
      <View style={styles.container}>
        <DailyHabitsList />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
