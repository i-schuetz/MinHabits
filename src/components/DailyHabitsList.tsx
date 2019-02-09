import React, { Component } from "react"

import { FlatList, Modal, StyleSheet, Text, View, Image, TouchableWithoutFeedback } from "react-native"
import { Habit } from "../models/Habit"
import NavigationBar from "react-native-navbar"
import EditHabitView from "./EditHabitView"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import {
  DailyHabitsListThunkDispatch,
  setSelectDateModalOpenAction,
  setTaskDoneStatusAction,
  setSelectHabitModalOpenAction,
} from "../redux/reducers/ui/DailyHabitsListReducer"
import { addNewHabitAction, setEditingHabitAction, exitEditingHabitAction } from "../redux/reducers/ui/EditHabitReducer"
import SelectDailyHabitsDateView from "./SelectDailyHabitsDateView"
import * as DateUtils from "../utils/DateUtils"
import { initSelectedDateAction } from "../redux/reducers/ui/DailyHabitsListReducer"
import { DayDate } from "../models/DayDate"
import * as DayDateHelpers from "../models/DayDate"
import { Order } from "../models/helpers/Order"
import { Task, TaskDoneStatus } from "../models/helpers/Task"
import * as SharedStyles from "../SharedStyles"
import { globalStyles } from "../SharedStyles"
import SelectHabitView from "./SelectHabitView"

interface PropsFromState {
  editHabitModalOpen: boolean
  selectHabitModalOpen: boolean
  editingHabit?: Habit
  tasks: Task[]
  selectDateModalOpen: boolean
  selectedDate?: DayDate
  title: string
}

interface PropsFromDispatch {
  addNewHabit: typeof addNewHabitAction
  editHabit: typeof setEditingHabitAction
  exitEditingHabit: typeof exitEditingHabitAction
  setSelectDateModalOpen: typeof setSelectDateModalOpenAction
  initSelectedDate: typeof initSelectedDateAction
  setTaskDone: typeof setTaskDoneStatusAction
  setSelectHabitModalOpen: typeof setSelectHabitModalOpenAction
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface DailyHabitsState {}

// TODO rename DailyTasksList
class DailyHabitsList extends Component<AllProps, DailyHabitsState> {
  componentWillMount() {
    this.props.initSelectedDate()
  }

  private onPressTask(task: Task) {
    this.props.setTaskDone(task, this.toggleDoneStatusOnPress(task))
  }

  // TODO unit test
  private toggleDoneStatusOnPress(task: Task): TaskDoneStatus {
    const isPast = DateUtils.isPast(task.date)
    switch (task.doneStatus) {
      case TaskDoneStatus.DONE:
        if (isPast) {
          // If user toggles a done past task, it means it was missed
          return TaskDoneStatus.MISSED
        } else {
          // If user toggles a done past task, it means it's open (at the moment only the system marks tasks as missed, at the end of the day)
          return TaskDoneStatus.OPEN
        }
      case TaskDoneStatus.MISSED:
        if (isPast) {
          // If user toggles a missed past task, it means that it was done.
          return TaskDoneStatus.DONE
        } else {
          // At the moment only the system marks tasks as missed, at the end of the day
          throw Error("Invalid state: A task in the present or future cannot be missed. Task" + JSON.stringify(task))
        }
      case TaskDoneStatus.OPEN:
        // Toggling an open task always means that it's done (at the moment only the system marks tasks as missed, at the end of the day)
        return TaskDoneStatus.DONE
    }
  }

  private onLongPressTask(task: Task) {
    this.props.editHabit(task.habit)
  }

  private isTodaySelected(): boolean {
    if (this.props.selectedDate === undefined) {
      return false
    }
    return DayDateHelpers.compare(this.props.selectedDate, DateUtils.today()) == Order.EQ
  }

  render() {
    const navigationRightButton = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.setSelectHabitModalOpen(true)
          }}
        >
          <Image
            style={{ width: 30, height: 30, marginTop: 10, marginRight: 15 }}
            source={require("../../assets/plus.png")}
          />
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View style={styles.container}>
        <NavigationBar
          title={
            <Text style={styles.title} onPress={() => this.props.setSelectDateModalOpen(true)}>
              {this.props.title}
            </Text>
          }
          rightButton={navigationRightButton()}
          style={globalStyles.navigationBar}
        />

        <FlatList
          // ItemSeparatorComponent={listSeparator}
          data={this.props.tasks}
          keyExtractor={(item, {}) => item.habit.name}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableWithoutFeedback
              onPress={({}) => this.onPressTask(item)}
              onLongPress={({}) => this.onLongPressTask(item)}
            >
              <View style={{ flexDirection: "column", flex: 1 }}>
                <View style={item.doneStatus == TaskDoneStatus.DONE ? styles.doneRow : globalStyles.habitRow}>
                  <Text
                    style={item.doneStatus == TaskDoneStatus.DONE ? styles.doneHabit : styles.undoneHabit}
                    numberOfLines={1}
                  >
                    {item.habit.name}
                  </Text>
                </View>
                {item.doneStatus == TaskDoneStatus.OPEN ? (
                  <View style={{ height: 0.5, backgroundColor: SharedStyles.dividersGrey }} />
                ) : null}
              </View>
            </TouchableWithoutFeedback>
          )}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.selectHabitModalOpen}
          onRequestClose={() => {
            this.props.setSelectHabitModalOpen(false)
          }}
        >
          <SelectHabitView />
        </Modal>

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

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.selectDateModalOpen}
          onRequestClose={() => {
            this.props.setSelectDateModalOpen(false)
          }}
        >
          {/* TODO redux. And also pass currently selected date, not today (defaults to today if not set yet or user(?) deactivates selection (how?) */}
          <SelectDailyHabitsDateView referenceDate={DateUtils.today()} />
        </Modal>
      </View>
    )
  }
}

const sharedStyles = StyleSheet.create({})

const styles = StyleSheet.create({
  container: {
    backgroundColor: SharedStyles.defaultBackgroundColor,
    // backgroundColor: "#f00",
    display: "flex",
    flex: 1,
  },
  list: {},
  doneRow: {
    ...globalStyles.habitRow,
    backgroundColor: SharedStyles.selectedHabitBackgroundColor,
  },
  undoneHabit: {
    ...globalStyles.habit,
  },
  doneHabit: {
    ...globalStyles.habit,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    color: SharedStyles.selectedHabitTextColor,
  },
  checkbox: {
    alignSelf: "center",
    marginRight: 20,
  },
  title: {
    ...globalStyles.navBarTitleText,
  },
})

const mapStateToProps = ({ ui }: ApplicationState) => ({
  editHabitModalOpen: ui.editHabit.editHabitModalOpen,
  selectHabitModalOpen: ui.dailyHabitsList.selectHabitModalOpen,
  editingHabit: ui.editHabit.editingHabit,
  tasks: ui.dailyHabitsList.tasks,
  selectDateModalOpen: ui.dailyHabitsList.selectDateModalOpen,
  selectedDate: ui.dailyHabitsList.selectedDate,
  title: ui.dailyHabitsList.title,
})
const mapDispatchToProps = (dispatch: DailyHabitsListThunkDispatch) => ({
  addNewHabit: () => dispatch(addNewHabitAction()),
  editHabit: (habit: Habit) => dispatch(setEditingHabitAction(habit)),
  exitEditingHabit: () => dispatch(exitEditingHabitAction()),
  setSelectDateModalOpen: (open: boolean) => dispatch(setSelectDateModalOpenAction(open)),
  initSelectedDate: () => dispatch(initSelectedDateAction()),
  setTaskDone: (task: Task, doneStatus: TaskDoneStatus) => dispatch(setTaskDoneStatusAction(task, doneStatus)),
  setSelectHabitModalOpen: (open: boolean) => dispatch(setSelectHabitModalOpenAction(open)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyHabitsList)
