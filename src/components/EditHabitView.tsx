import React, { Component, ReactNode } from "react"
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
  deleteHabitAction,
  showDeleteConfirmationPopupAction,
  HabitInputsValidationState,
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
import Dialog, { DialogButton, DialogContent } from "react-native-popup-dialog"
import { uiReducer } from "../redux/reducers/ui/UIReducer"

interface PropsFromState {
  editingHabit?: Habit
  editTimeRuleModalOpen: boolean
  inputs: EditHabitTemporaryInputs
  showingDeleteConfirmationPopup: boolean
  validations: HabitInputsValidationState
}
interface PropsFromDispatch {
  exitEditingHabit: typeof exitEditingHabitAction
  trySubmitInputs: typeof trySubmitHabitInputsAction
  setTimeRuleModalOpen: typeof setTimeRuleModalOpenAction
  setNameInput: typeof setNameInputAction
  setStartDateInput: typeof setStartDateInputAction
  deleteHabit: typeof deleteHabitAction
  showDeleteConfirmationPopup: typeof showDeleteConfirmationPopupAction
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

  private validationsView(errors: string[]): ReactNode {
    return errors.length == 0 ? null : (
      <Text style={{ color: SharedStyles.validationRed, textAlign: "center" }}>{errors.join(", ")}</Text>
    )
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

    const closeConfirmDeletePopupConfig = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.showDeleteConfirmationPopup(false)
          }}
        >
          {closeModalImage()}
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View>
        <NavigationBar title={titleConfig} rightButton={closeButtonConfig()} style={globalStyles.navigationBar} />
        <View style={styles.container}>
          {this.validationsView(this.props.validations.name)}
          <TextInput
            style={styles.nameInput}
            ref={this.textInput}
            placeholder="Name"
            defaultValue={this.props.inputs.name}
            onChangeText={text => {
              this.props.setNameInput(text)
            }}
          />

          {this.validationsView(this.props.validations.timeRule)}
          <Text style={styles.timeRuleButton} onPress={() => this.onPressTimeRule()}>
            {this.timeText()}
          </Text>

          {this.validationsView(this.props.validations.startDate)}
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

          {this.props.editingHabit === undefined ? null : (
            <TouchableHighlight
              style={[globalStyles.deleteButton, { marginTop: 60 }]}
              onPress={() => this.props.showDeleteConfirmationPopup(true)}
              underlayColor="#fff"
            >
              <Text style={globalStyles.submitButtonText}>{"Delete"}</Text>
            </TouchableHighlight>
          )}
        </View>
        <Modal isVisible={this.props.editTimeRuleModalOpen}>
          <EditTimeRuleView />
        </Modal>
        <Modal isVisible={this.props.showingDeleteConfirmationPopup}>
          <View style={{ backgroundColor: "#fff" }}>
            <NavigationBar
              title={{ title: "Confirm" }}
              rightButton={closeConfirmDeletePopupConfig()}
              style={globalStyles.navigationBar}
            />
            <Text>{"Are you sure you want to delete this habit?"}</Text>
            <TouchableHighlight
              style={globalStyles.deleteButton}
              onPress={() => this.props.deleteHabit()}
              underlayColor="#fff"
            >
              <Text style={globalStyles.submitButtonText}>{"Ok"}</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  nameInput: {
    height: 40,
    alignSelf: "center",
    marginLeft: SharedStyles.defaultSideMargins,
    marginRight: SharedStyles.defaultSideMargins,
    marginBottom: 60,
  },
  timeRuleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    alignSelf: "center",
    borderRadius: 6,
    marginBottom: 40,
  },
  startDateLabel: {
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
  showingDeleteConfirmationPopup: editHabit.showingDeleteConfirmationPopup,
  validations: editHabit.validations,
})
const mapDispatchToProps = (dispatch: EditHabitThunkDispatch) => ({
  exitEditingHabit: () => dispatch(exitEditingHabitAction()),
  trySubmitInputs: () => dispatch(trySubmitHabitInputsAction()),
  setTimeRuleModalOpen: (open: boolean) => dispatch(setTimeRuleModalOpenAction(open)),
  setNameInput: (name: string) => dispatch(setNameInputAction(name)),
  setStartDateInput: (date: DayDate) => dispatch(setStartDateInputAction(date)),
  deleteHabit: () => dispatch(deleteHabitAction()),
  showDeleteConfirmationPopup: (show: boolean) => dispatch(showDeleteConfirmationPopupAction(show)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditHabitView)
