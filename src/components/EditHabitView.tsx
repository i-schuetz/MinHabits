import React, { Component } from "react"
import { Button, StyleSheet, TextInput, View, Text, FlatList } from "react-native"
import NavigationBar from "react-native-navbar"
import { Habit } from "../models/Habit"
import { Weekday } from "../models/Weekday"
import { WeekdayTimeRuleValue, TimeRuleValue, EachTimeRuleValue } from "../models/TimeRuleValue"
import { DayDate } from "../models/DayDate"
import MyDatePicker from "./MyDatePicker"
import * as DateUtils from "../utils/DateUtils"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import { EditHabitInputs } from "../models/helpers/EditHabitInputs"
import {
  exitEditingHabitAction,
  trySubmitHabitInputsAction,
  EditHabitThunkDispatch,
  EditHabitTemporaryInputs,
  setTimeRuleModalOpenAction
} from "../redux/reducers/ui/EditHabitReducer"
import Modal from "react-native-modal"
import EditTimeRuleView from "./EditTimeRuleView"
import { FullWeekday } from "../models/helpers/FullWeekday"
import * as FullWeekdayHelpers from "../models/helpers/FullWeekday"
import * as FullTimeRuleUnitHelpers from "../models/helpers/FullTimeUnit"
import { FullTimeUnit } from "../models/helpers/FullTimeUnit"
import { associateBy } from "../utils/ArrayUtils"
import { TimeUnit } from "../models/TimeUnit";
var deepEqual = require('fast-deep-equal');

interface PropsFromState {
  editingHabit?: Habit
  editTimeRuleModalOpen: boolean
  inputs: EditHabitTemporaryInputs
}
interface PropsFromDispatch {
  exitEditingHabit: typeof exitEditingHabitAction
  trySubmitInputs: typeof trySubmitHabitInputsAction
  setTimeRuleModalOpen: typeof setTimeRuleModalOpenAction
}

export interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface OwnState {}

class EditHabitView extends Component<AllProps, OwnState> {
  private textInput: React.RefObject<TextInput>

  constructor(props: AllProps) {
    super(props)

    console.log("Editing habit: " + JSON.stringify(props.editingHabit))

    this.state = {
      name: props.editingHabit ? props.editingHabit.name : undefined,
      timeRuleValue: props.editingHabit ? props.editingHabit.time.value : undefined,
      startDate: props.editingHabit ? props.editingHabit.time.start : undefined
    }

    this.textInput = React.createRef()
  }

  private toggleWeekday(weekdays: Array<Weekday>, weekday: Weekday): Weekday[] {
    // TODO generic extension function? possible?
    if (weekdays.indexOf(weekday) != -1) {
      return weekdays.filter(element => element != weekday)
    } else {
      weekdays.push(weekday)
      return weekdays
    }
  }

  private selectedWeekdays(): Weekday[] {
    if (this.props.inputs.timeRuleValue === undefined) {
      // No time has been selected yet
      return []
    }
    switch (this.props.inputs.timeRuleValue.kind) {
      case "weekday":
        return this.props.inputs.timeRuleValue.weekdays
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
    return this.props.inputs.startDate === undefined ? DateUtils.today() : this.props.inputs.startDate
  }

  private toText(timeRuleValue: TimeRuleValue): string {
    switch (timeRuleValue.kind) {
      case "weekday":
        return this.toWeekdaysTimeRuleText(timeRuleValue.weekdays)
      case "each":
        return this.toEachTimeRuleText(timeRuleValue)
    }
  }

  private toEachTimeRuleText(timeRuleValue: EachTimeRuleValue) {
        const fullTimeUnit = this.toFullTimeUnit(timeRuleValue.unit)
        const timeUnitName = timeRuleValue.value == 1 ? fullTimeUnit.nameSingular: fullTimeUnit.namePlural
        return "Each " + timeRuleValue.value + " " + timeUnitName
  }

  private toWeekdaysTimeRuleText(weekdays: Weekday[]) {
    const allFullWeekdays = FullWeekdayHelpers.array()
    const fullWeekdaysMap = associateBy(fullWeekday => fullWeekday.weekday, allFullWeekdays)

    // Monday - Friday
    if (deepEqual(weekdays, [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday])) {
      return "On weekdays"
    }

    // Every day
    if (deepEqual(weekdays, allFullWeekdays.map((fullWeekday) => fullWeekday.weekday))) {
      return "Every day"
    } 

    const fullWeekdays = weekdays.map(weekday => {
      const fullWeekdayMaybe = fullWeekdaysMap.get(weekday)
      // TODO (low prio) enforce this check at compile time?
      if (fullWeekdayMaybe === undefined) {
        throw Error("There must exist a full week day object for each weekday. Weekday: " + weekday)
      }
      return fullWeekdayMaybe
    })

    // Individual days
    return fullWeekdays.map(fullWeekday => fullWeekday.name).join(", ")
  }

  private toFullWeekdays(weekdays: Weekday[]): FullWeekdayHelpers.FullWeekday[] {
    const fullWeekdays = FullWeekdayHelpers.array()
    const fullWeekdaysMap = associateBy(fullWeekday => fullWeekday.weekday, fullWeekdays)
    return weekdays.map(weekday => {
      const fullWeekdayMaybe = fullWeekdaysMap.get(weekday)
      // TODO (low prio) enforce this check at compile time?
      if (fullWeekdayMaybe === undefined) {
        throw Error("There must exist a full week day object for each weekday. Weekday: " + weekday)
      }
      return fullWeekdayMaybe
    })
  }

  private toFullTimeUnit(timeUnit: TimeUnit): FullTimeUnit {
    const fullTimeUnits = FullTimeRuleUnitHelpers.array()
    const fullTimeUnitsMap = associateBy(fullTimeUnit => fullTimeUnit.unit, fullTimeUnits)
    const tullTimeUnitMaybe = fullTimeUnitsMap.get(timeUnit)
    // TODO (low prio) enforce this check at compile time?
    if (tullTimeUnitMaybe === undefined) {
      throw Error("There must exist a full time unit object for each time unit. Time unit: " + timeUnit)
    }
    return tullTimeUnitMaybe
  }

  private timeText(): string {
    if (this.props.inputs.timeRuleValue !== undefined) {
      return this.toText(this.props.inputs.timeRuleValue)
    } else {
      return "Tap to schedule"
    }
  }

  private onPressTimeRule() {
    this.props.setTimeRuleModalOpen(true)
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
            defaultValue={this.props.inputs.name}
            onChangeText={text => {
              this.setState({ name: text }, () => {
                console.log("Habit name changed: " + JSON.stringify(this.state))
              })
            }}
          />
          <Text onPress={() => this.onPressTimeRule()}>{this.timeText()}</Text>
          <MyDatePicker date={this.startDate()} onSelectDate={(date: DayDate) => this.selectStartDate(date)} />
          <Button
            title="Submit"
            onPress={() => {
              this.props.trySubmitInputs()
            }}
          />
        </View>
        <Modal isVisible={this.props.editTimeRuleModalOpen}>
          <EditTimeRuleView />
        </Modal>
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

const mapStateToProps = ({ ui: { editHabit } }: ApplicationState) => ({
  inputs: editHabit.inputs,
  editingHabit: editHabit.editingHabit,
  editTimeRuleModalOpen: editHabit.editTimeRuleModalOpen
})
const mapDispatchToProps = (dispatch: EditHabitThunkDispatch) => ({
  exitEditingHabit: () => dispatch(exitEditingHabitAction()),
  trySubmitInputs: (inputs: EditHabitInputs) => dispatch(trySubmitHabitInputsAction()),
  setTimeRuleModalOpen: (open: boolean) => dispatch(setTimeRuleModalOpenAction(open))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditHabitView)
