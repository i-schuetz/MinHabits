import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import DailyHabitsList from "./components/DailyHabitsList";
import NavigationBar from "react-native-navbar";
import StatusBarArea from "./components/StatusBarArea";
import EditHabitView from "./components/EditHabitView";
import Repo from "./Repo";
import Habit from './models/Habit';

export interface AppState { habits: Array<Habit>; modalVisible: boolean; }

export default class App extends React.Component<any, AppState> {  
  
  state = {
    habits: Array<Habit>(),
    modalVisible: false
  };

  componentWillMount() {
    this.updateHabits()
  }

  setModalVisible(visible: boolean) {
    this.setState({ modalVisible: visible });
  }

  updateHabits = async () => {
    try {
      const habits = await Repo.loadItems();
      console.log("updating list with items: " + JSON.stringify(habits));
      this.setState({ habits: habits });
    } catch (error) {
      console.error("Error loading habits. ", error);
    }
  };

  submitHabit = async (habit: Habit) => {
    console.log("Submitting habit: " + JSON.stringify(habit));
    this.setModalVisible(false);
    await Repo.addHabit(habit);
    this.updateHabits();
  };

  render() {
    const rightButtonConfig = {
      title: "+",
      handler: () => this.setModalVisible(!this.state.modalVisible)
    };

    const titleConfig = {
      title: "Habits"
    };
    return (
      <View style={styles.container}>
        <StatusBarArea />
        <NavigationBar title={titleConfig} rightButton={rightButtonConfig} />
        <DailyHabitsList habits={this.state.habits} />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          <EditHabitView
            onSubmit={ (habit: Habit) => {
              this.setModalVisible(false);
              this.submitHabit(habit);
            }}
            onClose={ () => {
              this.setModalVisible(false);
            }}
          />
        </Modal>
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
