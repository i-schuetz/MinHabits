import React, { Component } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default class WeekdayPicker extends Component {
  state = { habit: null };

  render() {
    return (
      <View>
        <FlatList
          horizontal={true}
          style={styles.list}
          data={[
            { key: "m", name: "M" },
            { key: "t", name: "T" },
            { key: "w", name: "W" },
            { key: "th", name: "D" },
            { key: "f", name: "F" },
            { key: "s", name: "S" },
            { key: "su", name: "S" }
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.weekdayButtonContainer}
              onPress={() => this.props.onSelect(item.key)}
            >
              <Text style={styles.weekdayButton}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  weekdayButtonContainer: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  weekdayButton: {
    textAlign: "center",
    textAlignVertical: "center"
  }
});
