import React, { Component } from "react";

import { FlatList, StyleSheet, Text } from "react-native";
import Habit from "../models/Habit";

export interface DailyHabitsListProps { habits: Array<Habit> };

export default class DailyHabitsList extends Component<DailyHabitsListProps> {
  render() {
    return (
      <FlatList
        style={styles.list}
        data={this.props.habits}
        renderItem={({ item }) => <Text style={styles.habit}>{item.name}</Text>}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {},
  habit: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});
