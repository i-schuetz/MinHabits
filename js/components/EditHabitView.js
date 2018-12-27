import React, { Component } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import NavigationBar from "react-native-navbar";
import WeekdayPicker from "./WeekdayPicker";

export default class EditHabitView extends Component {
  state = { name: null, time: null };

  toggleWeekday(weekdays, weekday) {
    if (weekdays.includes(weekday)) {
      return weekdays.filter(element => element != weekday);
    } else {
      weekdays.push(weekday);
      return weekdays;
    }
  }

  toHabit(habitInputs) {
    if (!habitInputs.name || !habitInputs.time) {
      console.log("Input validation failed: " + JSON.stringify(habitInputs));
      return null;
    }
    return {
      name: habitInputs.name,
      time: habitInputs.time
    };
  }

  render() {
    const leftButtonConfig = {
      title: "x",
      handler: () => this.props.onClose()
    };

    const titleConfig = {
      title: "Add habit"
    };
    return (
      <View>
        <NavigationBar title={titleConfig} leftButton={leftButtonConfig} />
        <View>
          <TextInput
            style={styles.nameInput}
            ref={input => (this.textInput = input)}
            placeholder="Name"
            onChangeText={text => {
              this.setState({ name: text }, () => {
                console.log(
                  "Habit name changed: " +
                    JSON.stringify(this.state)
                );
              });
            }}
          />
          <WeekdayPicker
            style={styles.weekdayPicker}
            onSelect={key => {
              console.log("selected: " + key);
              this.setState(
                {
                  time: {
                    type: "wd",
                    value: this.toggleWeekday(
                      this.state.time
                        ? this.state.time.value
                        : [],
                      key
                    )
                  }
                },
                () => {
                  console.log(
                    "Habit name changed: " +
                      JSON.stringify(this.state)
                  );
                }
              );
            }}
          />
          <Button
            title="Submit"
            onPress={() => {
              const habit = this.toHabit(this.state);
              if (habit) {
                this.props.onSubmit(habit);
              }
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nameInput: {
    height: 40
  },
  weekdayPicker: {
    height: 50
  }
});
