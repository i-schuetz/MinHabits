import React, { Component } from "react"
import { FlatList, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import { Weekday } from "../models/Weekday"
import * as FullWeekdayHelpers from "../models/helpers/FullWeekday"

export interface WeekdayPickerProps {
  onSelect: (Weekday: Weekday) => void
  selectedWeekdays: Weekday[]
  style: StyleProp<ViewStyle>
}

export default class WeekdayPicker extends Component<WeekdayPickerProps> {
  render() {
    return (
      <View>
        <FlatList
          data={FullWeekdayHelpers.array()}
          horizontal={true}
          keyExtractor={(item, {}) => item.weekday.toString()}
          renderItem={({ item }) => {
            const isSelected = this.props.selectedWeekdays.some(selectedWeekday => selectedWeekday == item.weekday)
            return (
              <TouchableOpacity
                style={isSelected ? styles.selectedWeekdayButtonContainer : styles.unselectedWeekdayButtonContainer}
                onPress={() => this.props.onSelect(item.weekday)}
              >
                <Text style={isSelected ? styles.selectedWeekdayButton : styles.unselectedWeekdayButton}>
                  {item.shortName}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }
}

const sharedStyles = StyleSheet.create({
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
})

const styles = StyleSheet.create({
  unselectedWeekdayButtonContainer: {
    ...sharedStyles.weekdayButtonContainer
  },
  selectedWeekdayButtonContainer: {
    ...sharedStyles.weekdayButtonContainer,
    backgroundColor: "grey"
  },
  unselectedWeekdayButton: {
    ...sharedStyles.weekdayButton
  },
  selectedWeekdayButton: {
    ...sharedStyles.weekdayButton,
    color: "white"
  }
})
