import React, { Component } from "react"

import { FlatList, Modal, StyleSheet, Text, View, Image, TouchableWithoutFeedback } from "react-native"
import { Habit } from "../models/Habit"
import EditHabitView from "./EditHabitView"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import { DailyHabitsListThunkDispatch } from "../redux/reducers/ui/DailyHabitsListReducer"
import { setEditingHabitAction, exitEditingHabitAction } from "../redux/reducers/ui/EditHabitReducer"
import { getHabitsAction, deleteHabitAction, exitAction, reorderHabitsAction } from "../redux/reducers/ui/ManageHabitsReducer"
import * as SharedStyles from "../SharedStyles"
import { globalStyles } from "../SharedStyles"
import DraggableFlatList from "react-native-draggable-flatlist"
import Repo from "../Repo"

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
  reorderHabits: typeof reorderHabitsAction
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
      <View style={styles.container}>
        <DraggableFlatList
          data={this.props.habits}
          keyExtractor={(item, {}) => item.name}
          style={styles.list}
          scrollPercent={5}
          onMoveEnd={({ data }) => {
            if (data === null) return
            this.props.reorderHabits(data as Habit[])
          }}
          
          renderItem={({ item, index, move, moveEnd, isActive }) => (
            <View style={globalStyles.manageHabitsRow}>
              {/* <TouchableWithoutFeedback onPress={() => this.onPressDelete(item)} >
                <Image style={styles.deleteButton} source={require("../../assets/close.png")} />
              </TouchableWithoutFeedback> */}
              <TouchableWithoutFeedback
                style={{ flex: 1 }}
                onLongPress={move}
                onPressOut={moveEnd}
                onPress={() => this.onPressHabit(item)}
              >
                <View style={globalStyles.manageHabitsHabit}>
                  <Text style={{ fontSize: 18 }}>{item.name}</Text>
                </View>
              </TouchableWithoutFeedback>
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
  container: {
    backgroundColor: SharedStyles.defaultBackgroundColor,
    flex: 1,
  },
  list: {},
  habit: {
    fontSize: 18,
    textAlign: "center",
  },
  deleteButton: {
    width: 30,
    height: 30,
    tintColor: "#f99",
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
  reorderHabits: (newList: Habit[]) => dispatch(reorderHabitsAction(newList)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageHabitsView)
