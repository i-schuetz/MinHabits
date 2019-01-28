import React, { Component } from "react"

import { FlatList, Modal, StyleSheet, Text, View } from "react-native"
import { Habit } from "../models/Habit"
import EditHabitView from "./EditHabitView"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import {
  DailyHabitsListThunkDispatch,
} from "../redux/reducers/ui/DailyHabitsListReducer"
import { setEditingHabitAction, exitEditingHabitAction } from "../redux/reducers/ui/EditHabitReducer"
import { getHabitsAction, deleteHabitAction, exitAction } from "../redux/reducers/ui/ManageHabitsReducer"

interface PropsFromState {
  editHabitModalOpen: boolean
  editingHabit?: Habit
  habits: Habit[]
}

interface PropsFromDispatch {
  getHabits: typeof getHabitsAction
  editHabit: typeof setEditingHabitAction
  exitEditingHabit: typeof exitEditingHabitAction
  deleteHabit: typeof deleteHabitAction
  exit: typeof exitAction
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

class ManageHabitsView extends Component<AllProps> {
  componentWillMount() {
    this.props.getHabits()
  }

  private onPressHabit(habit: Habit) {
    this.props.editHabit(habit)
  }

  private onPressDelete(habit: Habit) {
    this.props.deleteHabit(habit)
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.props.habits}
          keyExtractor={(item, {}) => item.name}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View>
                <Text onPress={() => this.onPressDelete(item)}>{"x"}</Text>
              </View>
              <Text style={styles.habit} onPress={({}) => this.onPressHabit(item)}>
                {item.name}
              </Text>
            </View>
          )}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.editHabitModalOpen}
          onRequestClose={() => {
            this.props.exitEditingHabit()
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
  row: {
    flex: 1,
    flexDirection: "row",
  },
  habit: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {},
})

const mapStateToProps = ({ ui }: ApplicationState) => ({
  editHabitModalOpen: ui.editHabit.editHabitModalOpen,
  editingHabit: ui.editHabit.editingHabit,
  habits: ui.manageHabits.habits,
})
const mapDispatchToProps = (dispatch: DailyHabitsListThunkDispatch) => ({
  getHabits: () => dispatch(getHabitsAction()),
  editHabit: (habit: Habit) => dispatch(setEditingHabitAction(habit)),
  exitEditingHabit: () => dispatch(exitEditingHabitAction()),
  deleteHabit: (habit: Habit) => dispatch(deleteHabitAction(habit)),
  exit: () => dispatch(exitAction()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageHabitsView)
