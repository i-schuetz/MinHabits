import React, { Component } from "react"

import { FlatList, Modal, StyleSheet, Text, View } from "react-native"
import { Habit } from "../models/Habit"
import NavigationBar from "react-native-navbar"
import Repo from "../Repo"
import EditHabitView from "./EditHabitView"

export interface DailyHabitsState {
  habits: Habit[]
  modalVisible: boolean
}

export default class DailyHabitsList extends Component<any, DailyHabitsState> {
  state: DailyHabitsState = {
    habits: [],
    modalVisible: false
  }

  componentWillMount() {
    this.updateHabits()
  }

  private updateHabits = async () => {
    try {
      await Repo.init() // TODO only at app init (but async...), or prebundled db?
      const habits = await Repo.loadItems()
      console.log("updating list with items: " + JSON.stringify(habits))
      this.setState({ habits: habits })
    } catch (error) {
      console.error("Error loading habits. ", error)
    }
  }

  private submitHabit = async (habit: Habit) => {
    console.log("Submitting habit: " + JSON.stringify(habit))
    this.setModalVisible(false)
    await Repo.addHabit(habit)
    this.updateHabits()
  }

  private setModalVisible(visible: boolean) {
    this.setState({ modalVisible: visible })
  }

  render() {
    const rightButtonConfig = {
      title: "+",
      handler: () => this.setModalVisible(!this.state.modalVisible)
    }

    const titleConfig = {
      title: "Habits"
    }

    return (
      <View>
        <NavigationBar title={titleConfig} rightButton={rightButtonConfig} />
        <FlatList
          style={styles.list}
          data={this.state.habits}
          renderItem={({ item }) => <Text style={styles.habit}>{item.name}</Text>}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}
        >
          <EditHabitView
            onSubmit={(habit: Habit) => {
              this.setModalVisible(false)
              this.submitHabit(habit)
            }}
            onClose={() => {
              this.setModalVisible(false)
            }}
          />
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  list: {},
  habit: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
})
