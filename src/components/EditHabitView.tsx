import React, { Component } from "react"
import {
  Button,
  StyleSheet,
  TextInput,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
} from "react-native"
import NavigationBar from "react-native-navbar"
import { Habit } from "../models/Habit"
import { Weekday } from "../models/Weekday"
import { TimeRuleValue, EachTimeRuleValue } from "../models/TimeRuleValue"
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
  setTimeRuleModalOpenAction,
  setNameInputAction,
  setStartDateInputAction,
} from "../redux/reducers/ui/EditHabitReducer"
import Modal from "react-native-modal"
import EditTimeRuleView from "./EditTimeRuleView"
import * as FullWeekdayHelpers from "../models/helpers/FullWeekday"
import * as FullTimeRuleUnitHelpers from "../models/helpers/FullTimeUnit"
import { FullTimeUnit } from "../models/helpers/FullTimeUnit"
import { associateBy } from "../utils/ArrayUtils"
import { TimeUnit } from "../models/TimeUnit"
var deepEqual = require("fast-deep-equal")
import * as SharedStyles from "../SharedStyles"
import { globalStyles, closeModalImage } from "../SharedStyles"

interface PropsFromState {
  editingHabit?: Habit
  editTimeRuleModalOpen: boolean
  inputs: EditHabitTemporaryInputs
}
interface PropsFromDispatch {
  exitEditingHabit: typeof exitEditingHabitAction
  trySubmitInputs: typeof trySubmitHabitInputsAction
  setTimeRuleModalOpen: typeof setTimeRuleModalOpenAction
  setNameInput: typeof setNameInputAction
  setStartDateInput: typeof setStartDateInputAction
}

export interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface OwnState {}

class EditHabitView extends Component<AllProps, OwnState> {
  private textInput: React.RefObject<TextInput>
  private startDatePicker: React.RefObject<MyDatePicker>

  constructor(props: AllProps) {
    super(props)

    console.log("Editing habit: " + JSON.stringify(props.editingHabit))

    this.state = {
      name: props.editingHabit ? props.editingHabit.name : undefined,
      timeRuleValue: props.editingHabit ? props.editingHabit.time.value : undefined,
      startDate: props.editingHabit ? props.editingHabit.time.start : undefined,
    }

    this.textInput = React.createRef()
    this.startDatePicker = React.createRef()
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
    const timeUnitName = timeRuleValue.value == 1 ? fullTimeUnit.nameSingular : fullTimeUnit.namePlural
    return "Each " + timeRuleValue.value + " " + timeUnitName
  }

  private toWeekdaysTimeRuleText(weekdays: Weekday[]) {
    const allFullWeekdays = FullWeekdayHelpers.array()
    const fullWeekdaysMap = associateBy(fullWeekday => fullWeekday.weekday, allFullWeekdays)

    if (deepEqual(weekdays, [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday])) {
      return "On weekdays"
    }

    if (deepEqual(weekdays, allFullWeekdays.map(fullWeekday => fullWeekday.weekday))) {
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

  private onPressStartDateButton() {
    if (this.startDatePicker.current !== null) {
      this.startDatePicker.current.open()
    }
  }

  private startDateText(): string {
    return DateUtils.formatDayDateForUI(this.props.inputs.startDate)
  }

  render() {
    const closeButtonConfig = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.exitEditingHabit()
          }}
        >
          {closeModalImage()}
        </TouchableWithoutFeedback>
      )
    }

    const titleConfig = {
      title: "Add habit",
    }
    return (
      <View>
        <NavigationBar title={titleConfig} rightButton={closeButtonConfig()} style={globalStyles.navigationBar} />
        <View>
          <TextInput
            style={styles.nameInput}
            ref={this.textInput}
            placeholder="Name"
            defaultValue={this.props.inputs.name}
            onChangeText={text => {
              this.props.setNameInput(text)
            }}
          />
          <Text style={styles.timeRuleButton} onPress={() => this.onPressTimeRule()}>
            {this.timeText()}
          </Text>

          <Text style={styles.startDateLabel} onPress={() => this.onPressTimeRule()}>
            {"Starting on"}
          </Text>
          <Text style={styles.startDateButton} onPress={() => this.onPressStartDateButton()}>
            {this.startDateText()}
          </Text>

          <MyDatePicker
            ref={this.startDatePicker}
            showSelector={false}
            date={this.startDate()}
            onSelectDate={(date: DayDate) => this.props.setStartDateInput(date)}
          />

          <TouchableHighlight
            style={globalStyles.submitButton}
            onPress={() => this.props.trySubmitInputs()}
            underlayColor="#fff"
          >
            <Text style={globalStyles.submitButtonText}>{"Submit"}</Text>
          </TouchableHighlight>
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
    marginTop: 60,
    height: 40,
    alignSelf: "center",
    marginLeft: SharedStyles.defaultSideMargins,
    marginRight: SharedStyles.defaultSideMargins,
  },
  timeRuleButton: {
    marginTop: 60,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignSelf: "center",
    borderRadius: 6,
  },
  startDateLabel: {
    marginTop: 40,
    color: "#6666",
    alignSelf: "center",
  },
  startDateButton: {
    color: "#666",
    padding: 10,
    borderColor: "#666",
    alignSelf: "center",
    borderRadius: 6,
    marginBottom: 60,
  },

})

const mapStateToProps = ({ ui: { editHabit } }: ApplicationState) => ({
  inputs: editHabit.inputs,
  editingHabit: editHabit.editingHabit,
  editTimeRuleModalOpen: editHabit.editTimeRuleModalOpen,
})
const mapDispatchToProps = (dispatch: EditHabitThunkDispatch) => ({
  exitEditingHabit: () => dispatch(exitEditingHabitAction()),
  trySubmitInputs: () => dispatch(trySubmitHabitInputsAction()),
  setTimeRuleModalOpen: (open: boolean) => dispatch(setTimeRuleModalOpenAction(open)),
  setNameInput: (name: string) => dispatch(setNameInputAction(name)),
  setStartDateInput: (date: DayDate) => dispatch(setStartDateInputAction(date)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditHabitView)
