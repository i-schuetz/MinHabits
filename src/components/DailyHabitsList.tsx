import React, { Component } from "react"

import { FlatList, Modal, StyleSheet, Text, View } from "react-native"
import { Habit } from "../models/Habit"
import NavigationBar from "react-native-navbar"
import EditHabitView from "./EditHabitView"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import {
  DailyHabitsListThunkDispatch,
  setSelectDateModalOpenAction,
  setTaskDoneStatusAction
} from "../redux/reducers/ui/DailyHabitsListReducer"
import {
  addNewHabitAction,
  setEditingHabitAction,
  exitEditingHabitAction,
} from "../redux/reducers/ui/EditHabitReducer"
import SelectDailyHabitsDateView from "./SelectDailyHabitsDateView"
import * as DateUtils from "../utils/DateUtils"
import { initSelectedDateAction } from "../redux/reducers/ui/DailyHabitsListReducer"
import { DayDate } from "../models/DayDate"
import * as DayDateHelpers from "../models/DayDate"
import { Order } from "../models/helpers/Order"
import { Task, TaskDoneStatus } from "../models/helpers/Task"
import { Ionicons } from "@expo/vector-icons"
import { uiReducer } from "../redux/reducers/ui/UIReducer";

interface PropsFromState {
  editHabitModalOpen: boolean
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
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface DailyHabitsState {}

// TODO rename DailyTasksList
class DailyHabitsList extends Component<AllProps, DailyHabitsState> {
  componentWillMount() {
    this.props.initSelectedDate()
  }

  private addNewHabit() {
    this.props.addNewHabit()
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
        if (isPast) { // If user toggles a missed past task, it means that it was done.
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
    const rightButtonConfig = {
      title: "+",
      handler: () => this.addNewHabit()
    }

    return (
      <View>
        <NavigationBar
          title={
            <Text
              style={this.isTodaySelected() ? styles.titleToday : styles.titleNotToday}
              onPress={() => this.props.setSelectDateModalOpen(true)}
            >
              {this.props.title}
            </Text>
          }
          rightButton={rightButtonConfig}
        />
        <FlatList
          data={this.props.tasks}
          keyExtractor={(item, {}) => item.habit.name}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Ionicons
                name={item.doneStatus == TaskDoneStatus.DONE ? "md-checkbox" : "md-square-outline"}
                size={32}
                color="green"
              />
              <Text
                style={styles.habit}
                onPress={({}) => this.onPressTask(item)}
                onLongPress={({}) => this.onLongPressTask(item)}
              >
                {item.habit.name}
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

const styles = StyleSheet.create({
  list: {},
  row: {
    flex: 1,
    flexDirection: "row"
  },
  habit: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  titleToday: {},
  titleNotToday: {
    color: "blue"
  }
})

const mapStateToProps = ({ ui }: ApplicationState) => ({
  editHabitModalOpen: ui.editHabit.editHabitModalOpen,
  editingHabit: ui.editHabit.editingHabit,
  tasks: ui.dailyHabitsList.tasks,
  selectDateModalOpen: ui.dailyHabitsList.selectDateModalOpen,
  selectedDate: ui.dailyHabitsList.selectedDate,
  title: ui.dailyHabitsList.title
})
const mapDispatchToProps = (dispatch: DailyHabitsListThunkDispatch) => ({
  addNewHabit: () => dispatch(addNewHabitAction()),
  editHabit: (habit: Habit) => dispatch(setEditingHabitAction(habit)),
  exitEditingHabit: () => dispatch(exitEditingHabitAction()),
  setSelectDateModalOpen: (open: boolean) => dispatch(setSelectDateModalOpenAction(open)),
  initSelectedDate: () => dispatch(initSelectedDateAction()),
  setTaskDone: (task: Task, doneStatus: TaskDoneStatus) => dispatch(setTaskDoneStatusAction(task, doneStatus))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyHabitsList)
