import React, { Component } from "react"

import { FlatList, StyleSheet, Text, View, TextInput, Picker, Button } from "react-native"
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
  submitTimeRuleAction
} from "../redux/reducers/ui/EditHabitReducer"
import * as FullWeekdayHelpers from "../models/helpers/FullWeekday"
import { TimeRuleValue, WeekdayTimeRuleValue, EachTimeRuleValue } from "../models/TimeRuleValue"
import { Weekday } from "../models/Weekday"
import { TimeUnit } from "../models/TimeUnit"
import * as FullTimeUnitHelpers from "../models/helpers/FullTimeUnit"

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
    { name: "On each...", type: TimeRuleOptionType.EACH }
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
        <Text>{"Select time interval"}</Text>
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

  private weekdaysSelectionView(): JSX.Element {
    return (
      <View>
        <Text>{"Select weekday"}</Text>
        <FlatList
          style={styles.popupList}
          data={FullWeekdayHelpers.array()}
          keyExtractor={(item, {}) => item.name}
          renderItem={({ item }) => (
            <View style={styles.popupRow}>
              <Text style={this.isWeekdaySelected(item.weekday) ? styles.selectedPopupRowContent : styles.unSelectedPopupRowContent} onPress={({}) => this.onWeekdaySelected(item)}>
                {item.name}
              </Text>
            </View>
          )}
        />
        <Button title={"Submit"} onPress={() => this.onSubmitTimeRule()} />
      </View>
    )
  }

  private eachTimeRuleSelectionView(): JSX.Element {
    return (
      <View style={{ display: "flex" }}>
        <Text>{"Select interval"}</Text>
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
        <Button title={"Submit"} onPress={() => this.onSubmitTimeRule()} />
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
    const closeButtonConfig = {
      title: "x",
      handler: () => this.props.setTimeRuleModalOpen(false)
    }

    return (
      <View style={styles.container}>
        <NavigationBar title={{ title: "Scheduling" }} rightButton={closeButtonConfig} />
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
    height: 44
  }
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  popupList: {
    backgroundColor: "white"
  },
  popupRow: {
    flex: 1,
    flexDirection: "row"
  },
  unSelectedPopupRowContent: {
    ...sharedStyles.popupRowContent,
    color: "black"
  },
  selectedPopupRowContent: {
    ...sharedStyles.popupRowContent,
    color: "blue"
  }
})

const mapStateToProps = ({ ui }: ApplicationState) => ({
  editTimeRuleModalStep: ui.editHabit.editTimeRuleModalStep,
  timeRuleValue: ui.editHabit.inputs.timeRuleValueInTimeRulePopup,
  timeRuleOptionType: ui.editHabit.timeRuleOptionType
})

const mapDispatchToProps = (dispatch: DailyHabitsListThunkDispatch) => ({
  setTimeRuleModalOpen: (open: boolean) => dispatch(setTimeRuleModalOpenAction(open)),
  setTimeRuleModalStep: (step: EditTimeRuleModalStep) => dispatch(setTimeRuleModalStepAction(step)),
  setTimeRuleOptionType: (optionType: TimeRuleOptionType) => dispatch(setTimeRuleOptionTypeAction(optionType)),
  setWeekdaysTimeRule: (value: WeekdayTimeRuleValue) => dispatch(setWeekdaysTimeRuleAction(value)),
  setEachTimeRule: (value: EachTimeRuleValue) => dispatch(setEachTimeRuleAction(value)),
  submitTimeRule: () => dispatch(submitTimeRuleAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeRuleView)
