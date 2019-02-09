import React, { Component } from "react"

import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Picker,
  Button,
  TouchableWithoutFeedback,
  Image,
  TouchableHighlight,
} from "react-native"
import NavigationBar from "react-native-navbar"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import { DailyHabitsListThunkDispatch } from "../redux/reducers/ui/DailyHabitsListReducer"
import {
  setTimeRuleModalOpenAction,
  setTimeRuleModalStepAction,
  TimeRuleOptionType,
  EditTimeRuleModalStep,
  setTimeRuleOptionTypeAction,
  setWeekdaysTimeRuleAction,
  setEachTimeRuleAction,
  submitTimeRuleAction,
} from "../redux/reducers/ui/EditHabitReducer"
import * as FullWeekdayHelpers from "../models/helpers/FullWeekday"
import { TimeRuleValue, WeekdayTimeRuleValue, EachTimeRuleValue } from "../models/TimeRuleValue"
import { Weekday } from "../models/Weekday"
import { TimeUnit } from "../models/TimeUnit"
import * as FullTimeUnitHelpers from "../models/helpers/FullTimeUnit"
import { globalStyles, closeModalImage } from "../SharedStyles"
import * as SharedStyles from "../SharedStyles"

export type TimeRuleOption = {
  name: string
  type: TimeRuleOptionType
}

interface PropsFromState {
  editTimeRuleModalStep: EditTimeRuleModalStep
  timeRuleValue?: TimeRuleValue
  timeRuleOptionType?: TimeRuleOptionType
}

interface PropsFromDispatch {
  setTimeRuleModalOpen: typeof setTimeRuleModalOpenAction
  setTimeRuleModalStep: typeof setTimeRuleModalStepAction
  setTimeRuleOptionType: typeof setTimeRuleOptionTypeAction
  setWeekdaysTimeRule: typeof setWeekdaysTimeRuleAction
  setEachTimeRule: typeof setEachTimeRuleAction
  submitTimeRule: typeof submitTimeRuleAction
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface OwnState {}

// TODO rename DailyTasksList
class TimeRuleView extends Component<AllProps, OwnState> {
  firstlevelOptions: TimeRuleOption[] = [
    { name: "Weekly", type: TimeRuleOptionType.WEEKDAY },
    { name: "On each...", type: TimeRuleOptionType.EACH },
  ]

  private onFirstLevelSelection(selection: TimeRuleOption) {
    this.props.setTimeRuleOptionType(selection.type)
    this.props.setTimeRuleModalStep(EditTimeRuleModalStep.STEP2)
  }

  private determineSelectedWeekdays = (timeRuleValue: TimeRuleValue | undefined): Weekday[] => {
    if (timeRuleValue === undefined) {
      return []
    } else {
      switch (timeRuleValue.kind) {
        case "each":
          console.log("Warn: why are we in onWeekdaySelected with a current 'each' selection?")
          return []
        case "weekday":
          return timeRuleValue.weekdays
        default:
          return [] // Solves compiler warning, though this isn't reachable as we are covering all cases.
      }
    }
  }

  private onWeekdaySelected(selection: FullWeekdayHelpers.FullWeekday) {
    const selectedWeekdays = this.determineSelectedWeekdays(this.props.timeRuleValue)
    const updatedWeekdays = this.toggleWeekday(selectedWeekdays, selection.weekday)
    const timeRuleValue: WeekdayTimeRuleValue = { kind: "weekday", weekdays: updatedWeekdays }
    this.props.setWeekdaysTimeRule(timeRuleValue)
  }

  private overwriteWeekdaySelection(selection: FullWeekdayHelpers.FullWeekday[]) {
    const timeRuleValue: WeekdayTimeRuleValue = { kind: "weekday", weekdays: selection.map(weekday => weekday.weekday) }
    this.props.setWeekdaysTimeRule(timeRuleValue)
  }

  private deselectWeekdays() {
    const timeRuleValue: WeekdayTimeRuleValue = { kind: "weekday", weekdays: [] }
    this.props.setWeekdaysTimeRule(timeRuleValue)
  }

  private isWeekdaySelected(weekday: Weekday): boolean {
    return this.determineSelectedWeekdays(this.props.timeRuleValue).find(wd => wd == weekday) !== undefined
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

  private onSubmitTimeRule() {
    this.props.submitTimeRule()
  }

  private eachTimeRuleNumber(): number {
    const defaultValue = 1
    if (this.props.timeRuleValue === undefined) {
      return defaultValue
    }
    switch (this.props.timeRuleValue.kind) {
      case "each":
        return this.props.timeRuleValue.value
      case "weekday":
        return defaultValue
    }
  }

  private eachTimeRuleTimeUnit(): TimeUnit {
    const defaultValue = TimeUnit.Day
    if (this.props.timeRuleValue === undefined) {
      return TimeUnit.Day
    }
    switch (this.props.timeRuleValue.kind) {
      case "each":
        return this.props.timeRuleValue.unit
      case "weekday":
        return defaultValue
    }
  }

  private generateTimeUnitPickerValues(): JSX.Element[] {
    const isSingular = this.eachTimeRuleNumber() == 1
    return FullTimeUnitHelpers.array().map(timeUnit => (
      <Picker.Item
        label={isSingular ? timeUnit.nameSingular : timeUnit.namePlural}
        value={timeUnit.unit}
        key={timeUnit.unit}
      />
    ))
  }

  private onChangeEachTimeRuleNumberText(text: string) {
    // TODO input validation
    const value: number = text.length == 0 ? 0 : parseInt(text)
    if (isNaN(value)) {
      // TODO input validation and numeric keyboard
      return
    }

    const unit = this.eachTimeRuleTimeUnit()
    this.props.setEachTimeRule({ kind: "each", value: value, unit: unit })
  }

  private onChangeEachTimeRuleTimeUnit(timeUnit: TimeUnit) {
    // TODO input validation
    const value: number = this.eachTimeRuleNumber()
    this.props.setEachTimeRule({ kind: "each", value: value, unit: timeUnit })
  }

  private step1View(): JSX.Element {
    return (
      <View>
        <FlatList
          style={styles.popupList}
          data={this.firstlevelOptions}
          keyExtractor={(item, {}) => item.name}
          renderItem={({ item }) => (
            <View style={styles.popupRow}>
              <Text style={styles.unSelectedPopupRowContent} onPress={({}) => this.onFirstLevelSelection(item)}>
                {item.name}
              </Text>
            </View>
          )}
        />
      </View>
    )
  }

  weekdayOptions(): WeekdayOption[] {
    const weekdays: WeekdayOption[] = FullWeekdayHelpers.array().map(weekday => {
      const weekdayOption: WeekdayOption = { kind: "weekday", weekday: weekday }
      return weekdayOption
    })
    return weekdays.concat([{ kind: "workdays" }, { kind: "everyday" }])
  }

  weekdayOptionText(option: WeekdayOption): string {
    switch (option.kind) {
      case "weekday":
        return option.weekday.name
      case "workdays":
        return "Workdays"
      case "everyday":
        return "Everyday"
    }
  }

  weekdayOptionKey(option: WeekdayOption): string {
    return this.weekdayOptionText(option)
  }

  isSelected(option: WeekdayOption): boolean {
    switch (option.kind) {
      case "weekday":
        return this.isWeekdaySelected(option.weekday.weekday)
      case "workdays":
      case "everyday":
        return false
    }
  }

  areWorkdaysSelected(): boolean {
    const selectedWeekdays = this.determineSelectedWeekdays(this.props.timeRuleValue)
    console.log("???? " + JSON.stringify(selectedWeekdays))

    return (
      selectedWeekdays.length == 5 &&
      selectedWeekdays.find(wd => wd === Weekday.Monday) !== undefined &&
      selectedWeekdays.find(wd => wd === Weekday.Tuesday) !== undefined &&
      selectedWeekdays.find(wd => wd === Weekday.Wednesday) !== undefined &&
      selectedWeekdays.find(wd => wd === Weekday.Thursday) !== undefined &&
      selectedWeekdays.find(wd => wd === Weekday.Friday) !== undefined
    )
  }

  isEverydaySelected(): boolean {
    const selectedWeekdays = this.determineSelectedWeekdays(this.props.timeRuleValue)
    return selectedWeekdays.length == 7
  }

  weekdayOptionSelected(option: WeekdayOption) {
    switch (option.kind) {
      case "weekday":
        this.onWeekdaySelected(option.weekday)
        break
      case "workdays":
        if (this.areWorkdaysSelected()) {
          this.deselectWeekdays()
        } else {
          this.overwriteWeekdaySelection(FullWeekdayHelpers.workdays())
        }
        break
      case "everyday":
        if (this.isEverydaySelected()) {
          this.deselectWeekdays()
        } else {
          this.overwriteWeekdaySelection(FullWeekdayHelpers.array())
        }
        break
    }
  }

  isLastWeekday(option: WeekdayOption) {
    switch (option.kind) {
      case "weekday":
        return option.weekday.weekday === Weekday.Sunday
      case "workdays":
      case "everyday":
        return false
    }
  }

  private weekdaysSelectionView(): JSX.Element {
    return (
      <View>
        <FlatList
          style={styles.popupList}
          data={this.weekdayOptions()}
          keyExtractor={(item, {}) => this.weekdayOptionKey(item)}
          renderItem={({ item }) => (
            <View style={styles.popupRow}>
              <Text
                style={this.isSelected(item) ? styles.selectedPopupRowContent : styles.unSelectedPopupRowContent}
                onPress={({}) => this.weekdayOptionSelected(item)}
              >
                {this.weekdayOptionText(item)}
              </Text>
              {this.isLastWeekday(item) ? (
                <View style={{ height: 0.5, backgroundColor: SharedStyles.dividersGrey }} />
              ) : null}
            </View>
          )}
        />

        <TouchableHighlight
          style={globalStyles.submitButton}
          onPress={() => this.onSubmitTimeRule()}
          underlayColor="#fff"
        >
          <Text style={globalStyles.submitButtonText}>{"Submit"}</Text>
        </TouchableHighlight>
      </View>
    )
  }

  private eachTimeRuleSelectionView(): JSX.Element {
    return (
      <View style={{ display: "flex" }}>
        <Text>{"Each"}</Text>
        <TextInput
          placeholder="1"
          defaultValue={this.eachTimeRuleNumber().toString()}
          onChangeText={text => this.onChangeEachTimeRuleNumberText(text)}
        />
        <Picker
          selectedValue={this.eachTimeRuleTimeUnit()}
          onValueChange={(itemValue, {}) => this.onChangeEachTimeRuleTimeUnit(itemValue)}
        >
          {this.generateTimeUnitPickerValues()}
        </Picker>
        <TouchableHighlight
          style={globalStyles.submitButton}
          onPress={() => this.onSubmitTimeRule()}
          underlayColor="#fff"
        >
          <Text style={globalStyles.submitButtonText}>{"Submit"}</Text>
        </TouchableHighlight>
      </View>
    )
  }

  private step1ViewMaybe(): JSX.Element | null {
    if (this.isInStep1()) {
      return this.step1View()
    }
    return null
  }

  private weekdaysSelectionViewMaybe(): JSX.Element | null {
    if (this.isInStep2() && this.selectedTimeRule(TimeRuleOptionType.WEEKDAY)) {
      return this.weekdaysSelectionView()
    }
    return null
  }

  private eachTimeRuleSelectionViewMaybe(): JSX.Element | null {
    if (this.isInStep2() && this.selectedTimeRule(TimeRuleOptionType.EACH)) {
      return this.eachTimeRuleSelectionView()
    }
    return null
  }
  private isInStep1(): boolean {
    return this.props.editTimeRuleModalStep == EditTimeRuleModalStep.STEP1
  }

  private isInStep2(): boolean {
    return this.props.editTimeRuleModalStep == EditTimeRuleModalStep.STEP2
  }

  private selectedTimeRule(type: TimeRuleOptionType): boolean {
    return this.props.timeRuleOptionType !== undefined && this.props.timeRuleOptionType == type
  }

  render() {
    const closeButtonConfig = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.setTimeRuleModalOpen(false)
          }}
        >
          {closeModalImage()}
        </TouchableWithoutFeedback>
      )
    }

    const backButtonConfig = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.setTimeRuleModalStep(EditTimeRuleModalStep.STEP1)
          }}
        >
          <Image
            style={{ width: 30, height: 30, marginTop: 10, marginRight: 15 }}
            source={require("../../assets/back.png")}
          />
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View style={styles.container}>
        <NavigationBar
          title={{ title: "Scheduling" }}
          leftButton={this.props.editTimeRuleModalStep == EditTimeRuleModalStep.STEP1 ? undefined : backButtonConfig()}
          rightButton={closeButtonConfig()}
          style={globalStyles.navigationBar}
        />
        {this.step1ViewMaybe()}
        {this.weekdaysSelectionViewMaybe()}
        {this.eachTimeRuleSelectionViewMaybe()}
      </View>
    )
  }
}

const sharedStyles = StyleSheet.create({
  popupRowContent: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  popupList: {
    backgroundColor: "white",
  },
  popupRow: {
    flex: 1,
    flexDirection: "column",
  },
  unSelectedPopupRowContent: {
    ...sharedStyles.popupRowContent,
    color: "black",
  },
  selectedPopupRowContent: {
    ...sharedStyles.popupRowContent,
    color: "blue",
  },
})

const mapStateToProps = ({ ui }: ApplicationState) => ({
  editTimeRuleModalStep: ui.editHabit.editTimeRuleModalStep,
  timeRuleValue: ui.editHabit.inputs.timeRuleValueInTimeRulePopup,
  timeRuleOptionType: ui.editHabit.timeRuleOptionType,
})

const mapDispatchToProps = (dispatch: DailyHabitsListThunkDispatch) => ({
  setTimeRuleModalOpen: (open: boolean) => dispatch(setTimeRuleModalOpenAction(open)),
  setTimeRuleModalStep: (step: EditTimeRuleModalStep) => dispatch(setTimeRuleModalStepAction(step)),
  setTimeRuleOptionType: (optionType: TimeRuleOptionType) => dispatch(setTimeRuleOptionTypeAction(optionType)),
  setWeekdaysTimeRule: (value: WeekdayTimeRuleValue) => dispatch(setWeekdaysTimeRuleAction(value)),
  setEachTimeRule: (value: EachTimeRuleValue) => dispatch(setEachTimeRuleAction(value)),
  submitTimeRule: () => dispatch(submitTimeRuleAction()),
  goBack: () => dispatch(setTimeRuleModalStepAction(EditTimeRuleModalStep.STEP1)), // There's only step 1 and 2
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeRuleView)

export type WeekdayOption = WeekdayOptionWeekday | WeekdayOptionWorkdays | WeekdayOptionEveryday

export interface WeekdayOptionWeekday {
  kind: "weekday"
  weekday: FullWeekdayHelpers.FullWeekday
}

export interface WeekdayOptionWorkdays {
  kind: "workdays"
}

export interface WeekdayOptionEveryday {
  kind: "everyday"
}
