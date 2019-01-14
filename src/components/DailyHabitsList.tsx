import React, { Component, Dispatch } from "react"

import { FlatList, Modal, StyleSheet, Text, View } from "react-native"
import { Habit } from "../models/Habit"
import NavigationBar from "react-native-navbar"
import Repo from "../Repo"
import EditHabitView from "./EditHabitView"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import { addNewHabitAction, setEditingHabitAction, exitEditingHabitAction } from "../redux/reducers/ui/DailyHabitsListReducer"
import { Action } from "redux";

interface PropsFromState {
  editHabitModalOpen: boolean
  editingHabit?: Habit
}

interface PropsFromDispatch {
  addNewHabit: typeof addNewHabitAction
  editHabit: typeof setEditingHabitAction
  exitEditingHabit: typeof exitEditingHabitAction
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface DailyHabitsState {
  habits: Habit[]
}

class DailyHabitsList extends Component<AllProps, DailyHabitsState> {
  state: DailyHabitsState = {
    habits: []
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
    this.closeModal()
    await Repo.addHabit(habit)
    this.updateHabits()
  }

  private addNewHabit() {
    this.props.addNewHabit()
  }

  private closeModal() {
    this.props.exitEditingHabit()
  }

  private onSelectHabit(habit: Habit) {
    this.props.editHabit(habit)
  }

  render() {
    const rightButtonConfig = {
      title: "+",
      handler: () => this.addNewHabit()
    }

    const titleConfig = {
      title: "Habits"
    }

    return (
      <View>
        <NavigationBar title={titleConfig} rightButton={rightButtonConfig} />
        <FlatList
          data={this.state.habits}
          keyExtractor={(item, {}) => item.name}
          style={styles.list}
          renderItem={({ item }) => (
            <Text style={styles.habit} onPress={({}) => this.onSelectHabit(item)}>
              {item.name}
            </Text>
          )}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.editHabitModalOpen}
          onRequestClose={() => {
            this.closeModal()
          }}
        >
          <EditHabitView
            onSubmit={(habit: Habit) => {
              this.closeModal()
              this.submitHabit(habit)
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

const mapStateToProps = ({ ui: { dailyHabitsList } }: ApplicationState) => ({
  editHabitModalOpen: dailyHabitsList.editHabitModalOpen,
  editingHabit: dailyHabitsList.editingHabit
})
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
  addNewHabit: () => dispatch(addNewHabitAction()),
  editHabit: (habit: Habit) => dispatch(setEditingHabitAction(habit)),
  exitEditingHabit: () => dispatch(exitEditingHabitAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyHabitsList)
