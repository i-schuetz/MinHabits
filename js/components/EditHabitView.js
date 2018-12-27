import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import NavigationBar from "react-native-navbar";

export default class EditHabitView extends Component {
  state = { habit: null };

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
              this.setState({ habit: { name: text } }, () => {
                console.log(
                  "Habit name changed: " + JSON.stringify(this.state.habit)
                );
              });
            }}
          />

          <Button
            title="Submit"
            onPress={() => {
              this.props.onSubmit(this.state.habit);
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
  }
});
