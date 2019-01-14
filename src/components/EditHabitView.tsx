import React, { Component, Dispatch } from "react"
import { Button, StyleSheet, TextInput, View } from "react-native"
import NavigationBar from "react-native-navbar"
import WeekdayPicker from "./WeekdayPicker"
import { Habit } from "../models/Habit"
import { Weekday } from "../models/Weekday"
import { WeekdayTimeRuleValue, TimeRuleValue } from "../models/TimeRuleValue"
import { DayDate } from "../models/DayDate"
import MyDatePicker from "./MyDatePicker"
import { DateUtils } from "../utils/DateUtils"
import { ApplicationState } from '../redux/reducers/RootReducer';
import { Action } from "redux";
import { connect } from "react-redux"
import { exitEditingHabitAction } from '../redux/reducers/ui/DailyHabitsListReducer';

interface PropsFromState {
  editingHabit?: Habit
}
interface PropsFromDispatch {
  exitEditingHabit: typeof exitEditingHabitAction
}

export interface OwnProps {
  onSubmit: (habit: Habit) => void
}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface EditHabitViewState {
  name?: string
  timeRuleValue?: TimeRuleValue
  startDate?: DayDate
}

class EditHabitView extends Component<AllProps, EditHabitViewState> {
  private textInput: React.RefObject<TextInput>

  constructor(props: AllProps) {
    super(props)

    console.log("Editing habit: " + JSON.stringify(props.editingHabit));
    
    this.state = {
      name: props.editingHabit ? props.editingHabit.name : undefined,
      timeRuleValue: props.editingHabit ? props.editingHabit.time.value : undefined,
      startDate: props.editingHabit ? props.editingHabit.time.start : undefined
    }

    this.textInput = React.createRef()
  }

  state: EditHabitViewState = { name: undefined, timeRuleValue: undefined }

  private toggleWeekday(weekdays: Array<Weekday>, weekday: Weekday): Array<Weekday> {
    // TODO generic extension function? possible?
    if (weekdays.indexOf(weekday) != -1) {
      return weekdays.filter(element => element != weekday)
    } else {
      weekdays.push(weekday)
      return weekdays
    }
  }

  private toHabit(habitInputs: EditHabitViewState): Habit | null {
    if (!habitInputs.name || !habitInputs.timeRuleValue || !habitInputs.startDate) {
      console.log("Input validation failed: " + JSON.stringify(habitInputs))
      return null
    }
    return {
      name: habitInputs.name,
      time: {
        value: habitInputs.timeRuleValue,
        start: habitInputs.startDate
      }
    }
  }

  private selectedWeekdays(): Weekday[] {
    if (this.state.timeRuleValue === undefined) {
      // No time has been selected yet
      return []
    }
    switch (this.state.timeRuleValue.kind) {
      case "weekday":
        return this.state.timeRuleValue.weekdays
      case "each":
        return []
    }
  }

  private selectStartDate(daydate: DayDate) {
    this.setState({ startDate: daydate })
  }

  private onSelectWeekday(weekday: Weekday) {
    const selectedWeekdays = this.selectedWeekdays()
    const updatedWeekdays = this.toggleWeekday(selectedWeekdays, weekday)
    const timeRuleValue: WeekdayTimeRuleValue = { kind: "weekday", weekdays: updatedWeekdays }
    this.setState({ timeRuleValue: timeRuleValue }, () => {
      console.log("State changed: " + JSON.stringify(this.state))
    })
  }

  private startDate(): DayDate {
    return this.state.startDate === undefined ? DateUtils.today() : this.state.startDate
  }

  render() {
    const leftButtonConfig = {
      title: "x",
      handler: () => this.props.exitEditingHabit()
    }

    const titleConfig = {
      title: "Add habit"
    }
    return (
      <View>
        <NavigationBar title={titleConfig} leftButton={leftButtonConfig} />
        <View>
          <TextInput
            style={styles.nameInput}
            ref={this.textInput}
            placeholder="Name"
            defaultValue={this.state.name}
            onChangeText={text => {
              this.setState({ name: text }, () => {
                console.log("Habit name changed: " + JSON.stringify(this.state))
              })
            }}
          />
          <WeekdayPicker
            style={styles.weekdayPicker}
            selectedWeekdays={this.selectedWeekdays()}
            onSelect={(weekday: Weekday) => this.onSelectWeekday(weekday)}
          />
          <MyDatePicker date={this.startDate()} onSelectDate={(date: DayDate) => this.selectStartDate(date)} />
          <Button
            title="Submit"
            onPress={() => {
              const habit = this.toHabit(this.state)
              if (habit) {
                this.props.onSubmit(habit)
              }
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  nameInput: {
    height: 40
  },
  weekdayPicker: {
    height: 50
  }
})

const mapStateToProps = ({ ui: { dailyHabitsList } }: ApplicationState) => ({
  editingHabit: dailyHabitsList.editingHabit
})
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({
  exitEditingHabit: () => dispatch(exitEditingHabitAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditHabitView)
