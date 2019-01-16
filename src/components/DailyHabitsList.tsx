import React, { Component } from "react"

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
  MyThunkDispatch,
  setSelectDateModalOpenAction
} from "../redux/reducers/ui/DailyHabitsListReducer"
import SelectDailyHabitsDateView from "./SelectDailyHabitsDateView"
import * as DateUtils from "../utils/DateUtils"
import { initSelectedDateAction } from "../redux/reducers/ui/DailyHabitsListReducer"
import { DayDate } from "../models/DayDate"
import * as DayDateHelpers from "../models/DayDate"
import { Order } from "../models/Order"

interface PropsFromState {
  editHabitModalOpen: boolean
  editingHabit?: Habit
  habits: Habit[]
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
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface DailyHabitsState {}

class DailyHabitsList extends Component<AllProps, DailyHabitsState> {
  state: DailyHabitsState = {
    habits: []
  }

  componentWillMount() {
    this.props.initSelectedDate()
  }

  private addNewHabit() {
    this.props.addNewHabit()
  }

  private onSelectHabit(habit: Habit) {
    this.props.editHabit(habit)
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

const mapStateToProps = ({ ui: { dailyHabitsList } }: ApplicationState) => ({
  editHabitModalOpen: dailyHabitsList.editHabitModalOpen,
  editingHabit: dailyHabitsList.editingHabit,
  habits: dailyHabitsList.habits,
  selectDateModalOpen: dailyHabitsList.selectDateModalOpen,
  selectedDate: dailyHabitsList.selectedDate,
  title: dailyHabitsList.title
})
const mapDispatchToProps = (dispatch: MyThunkDispatch) => ({
  addNewHabit: () => dispatch(addNewHabitAction()),
  editHabit: (habit: Habit) => dispatch(setEditingHabitAction(habit)),
  exitEditingHabit: () => dispatch(exitEditingHabitAction()),
  setSelectDateModalOpen: (open: boolean) => dispatch(setSelectDateModalOpenAction(open)),
  initSelectedDate: () => dispatch(initSelectedDateAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyHabitsList)
