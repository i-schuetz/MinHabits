import React, { Component } from "react"

import { FlatList, StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native"
import { Habit } from "../models/Habit"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import { DailyHabitsListThunkDispatch, setSelectHabitModalOpenAction } from "../redux/reducers/ui/DailyHabitsListReducer"
import { setEditingHabitAction, exitEditingHabitAction, addNewHabitAction } from "../redux/reducers/ui/EditHabitReducer"
import { getHabitsAction, exitAction } from "../redux/reducers/ui/ManageHabitsReducer"
import * as SharedStyles from "../SharedStyles"
import NavigationBar from "react-native-navbar"
import { globalStyles, closeModalImage } from "../SharedStyles"

interface PropsFromState {
  habits: Habit[]
}

interface PropsFromDispatch {
  getHabits: typeof getHabitsAction
  addNewHabit: typeof addNewHabitAction
  editHabit: typeof setEditingHabitAction
  setSelectHabitModalOpen: typeof setSelectHabitModalOpenAction
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

type ListItem = ListItemNew | ListItemHabit

export interface ListItemNew {
  kind: "new"
}

export interface ListItemHabit {
  kind: "habit"
  habit: Habit
}

class ManageHabitsView extends Component<AllProps> {
  componentWillMount() {
    this.props.getHabits()
  }

  private toListItems(habits: Habit[]): ListItem[] {
    const habitItems: ListItemHabit[] = habits.map(habit => {
      const habitItem: ListItemHabit = { kind: "habit", habit: habit }
      return habitItem
    })
    const items: ListItem[] = [{ kind: "new" }]
    return items.concat(habitItems)
  }

  private key(listItem: ListItem) {
    switch (listItem.kind) {
      case "new":
        return listItem.kind
      case "habit":
        return listItem.habit.name
    }
  }

  private label(listItem: ListItem) {
    switch (listItem.kind) {
      case "new":
        return "New habit"
      case "habit":
        return listItem.habit.name
    }
  }

  private onPressItem(listItem: ListItem) {
    switch (listItem.kind) {
      case "new":
        this.props.addNewHabit()
        break
      case "habit":
        this.props.editHabit(listItem.habit)
        break
    }
  }

  render() {
    const closeButtonConfig = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.setSelectHabitModalOpen(false)
          }}
        >
          {closeModalImage()}
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View style={styles.container}>
        <NavigationBar
          title={{ title: "Add..." }}
          rightButton={closeButtonConfig()}
          style={globalStyles.navigationBar}
        />

        <FlatList
          data={this.toListItems(this.props.habits)}
          keyExtractor={(item, {}) => this.key(item)}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={globalStyles.manageHabitsRow}>
              <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => this.onPressItem(item)}>
                <View style={globalStyles.manageHabitsHabit}>
                  <Text style={{ fontSize: 18 }}>{this.label(item)}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        />
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
})

const mapStateToProps = ({ ui }: ApplicationState) => ({
  editHabitModalOpen: ui.editHabit.editHabitModalOpen,
  editingHabit: ui.editHabit.editingHabit,
  habits: ui.manageHabits.habits,
})
const mapDispatchToProps = (dispatch: DailyHabitsListThunkDispatch) => ({
  getHabits: () => dispatch(getHabitsAction()),
  addNewHabit: () => dispatch(addNewHabitAction()),
  editHabit: (habit: Habit) => dispatch(setEditingHabitAction(habit)),
  exitEditingHabit: () => dispatch(exitEditingHabitAction()),
  exit: () => dispatch(exitAction()),
  setSelectHabitModalOpen: (open: boolean) => dispatch(setSelectHabitModalOpenAction(open)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageHabitsView)
