import React, { Component, Dispatch } from "react"

import { FlatList, Modal, StyleSheet, Text, View } from "react-native"
import { Habit } from "../models/Habit"
import NavigationBar from "react-native-navbar"
import EditHabitView from "./EditHabitView"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import {
  addNewHabitAction,
  setEditingHabitAction,
  exitEditingHabitAction,
  retrieveHabitsAction,
  MyThunkDispatch
} from "../redux/reducers/ui/DailyHabitsListReducer"

interface PropsFromState {
  editHabitModalOpen: boolean
  editingHabit?: Habit
  habits: Habit[]
}

interface PropsFromDispatch {
  addNewHabit: typeof addNewHabitAction
  editHabit: typeof setEditingHabitAction
  exitEditingHabit: typeof exitEditingHabitAction
  retrieveHabits: typeof retrieveHabitsAction
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface DailyHabitsState {}

class DailyHabitsList extends Component<AllProps, DailyHabitsState> {
  state: DailyHabitsState = {
    habits: []
  }

  componentWillMount() {
    this.props.retrieveHabits()
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
          data={this.props.habits}
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
          <EditHabitView />
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
  editingHabit: dailyHabitsList.editingHabit,
  habits: dailyHabitsList.habits
})
const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  addNewHabit: () => dispatch(addNewHabitAction()),
  editHabit: (habit: Habit) => dispatch(setEditingHabitAction(habit)),
  exitEditingHabit: () => dispatch(exitEditingHabitAction()),
  retrieveHabits: () => dispatch(retrieveHabitsAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyHabitsList)
