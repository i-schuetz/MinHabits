import React, { Component } from "react"
import { StyleSheet, View, FlatList, Text, TouchableWithoutFeedback, Image } from "react-native"
import NavigationBar from "react-native-navbar"
import { DayDate } from "../models/DayDate"
import * as DayDateHelpers from "../models/DayDate"
import * as DateUtils from "../utils/DateUtils"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import {
  DailyHabitsListThunkDispatch,
  setSelectDateModalOpenAction,
  selectDateAction,
  setEnterCustomDateModalOpenAction,
} from "../redux/reducers/ui/DailyHabitsListReducer"
import { DailyListDayDateViewData } from "../models/view_data/DailyListFormattedDayDate"
import * as DailyListFormattedDayDateHelpers from "../models/view_data/DailyListFormattedDayDate"
import { Order } from "../models/helpers/Order"
import MyDatePicker from "./MyDatePicker"
import * as SharedStyles from "../SharedStyles"
var deepEqual = require("fast-deep-equal")
import { globalStyles, listSeparator, closeModalImage } from "../SharedStyles"

interface PropsFromState {
  enterCustomDateModalOpen: boolean
}

interface PropsFromDispatch {
  setSelectDateModalOpen: typeof setSelectDateModalOpenAction
  selectDate: typeof selectDateAction
  setEnterCustomDateModalOpen: typeof setEnterCustomDateModalOpenAction
}

export interface OwnProps {
  referenceDate: DayDate // TODO redux
}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps
export interface FooState {
  dateSelection?: DayDate
}
class SelectDailyHabitsDateView extends Component<AllProps, FooState> {
  private datePicker: React.RefObject<MyDatePicker>

  constructor(props: AllProps) {
    super(props)

    this.datePicker = React.createRef()

    this.state = {
      dateSelection: undefined,
    }
  }

  private generateWeekDayDates(dayDate: DayDate): DayDate[] {
    return DateUtils.getSurroundingWeek(dayDate)
  }

  private format(dayDate: DayDate, isReferenceDate: boolean): DailyListDayDateViewData {
    return DailyListFormattedDayDateHelpers.fromDayDate(dayDate, isReferenceDate)
  }

  private generateWeekDayDatesViewData(dayDate: DayDate): DailyListDayDateViewData[] {
    return this.generateWeekDayDates(dayDate).map(dd =>
      this.format(dd, DayDateHelpers.compare(dayDate, dd) == Order.EQ)
    )
  }

  private generateListViewData(dayDate: DayDate): ListEntryViewData[] {
    const weekdaysEntries: ListEntryViewData[] = this.generateWeekDayDatesViewData(dayDate).map(dayDateViewData => {
      const viewData: DateEntryViewData = { kind: "date", key: dayDateViewData.formatted, date: dayDateViewData }
      return viewData
    })
    const enterCustomDateEntry: ListEntryViewData = { kind: "enterCustomDate", key: "" }
    return weekdaysEntries.concat(enterCustomDateEntry)
  }

  private style(entry: ListEntryViewData) {
    switch (entry.kind) {
      case "date":
        return entry.date.isReferenceDate ? styles.referenceDateEntry : styles.defaultDateEntry
      case "enterCustomDate":
        return styles.defaultDateEntry
    }
  }

  private onPress(entry: ListEntryViewData) {
    switch (entry.kind) {
      case "date":
        this.onSelectDayDate(entry.date.dayDate)
        break
      case "enterCustomDate":
        if (this.datePicker.current !== null) {
          this.datePicker.current.open()
        }
        break
    }
  }

  /**
   * Called either when tapping on a date list entry or when submitting a custom date with the picker
   */
  private onSelectDayDate(date: DayDate) {
    this.props.selectDate(date)
  }

  private text(entry: ListEntryViewData) {
    switch (entry.kind) {
      case "date":
        if (deepEqual(entry.date.dayDate, DateUtils.today())) {
          return entry.date.formatted + " (today)"
        } else {
          return entry.date.formatted
        }
      case "enterCustomDate":
        return "Enter date"
    }
  }

  render() {
    const closeButtonConfig = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.setSelectDateModalOpen(false)
          }}
        >
          <Image
            style={{ width: 30, height: 30, marginTop: 10, marginRight: 15 }}
            source={require("../../assets/close.png")}
          />
        </TouchableWithoutFeedback>
      )
    }

    const titleConfig = {
      title: "Dates",
    }

    return (
      <View>
        <NavigationBar title={titleConfig} rightButton={closeButtonConfig()} style={globalStyles.navigationBar} />
        <FlatList
          ItemSeparatorComponent={listSeparator}
          data={this.generateListViewData(this.props.referenceDate)}
          keyExtractor={(item: ListEntryViewData, {}) => item.key}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={globalStyles.flatRow}>
              <Text style={this.style(item)} onPress={() => this.onPress(item)}>
                {this.text(item)}
              </Text>
            </View>
          )}
        />
        <MyDatePicker
          showSelector={false}
          date={DateUtils.today()}
          ref={this.datePicker}
          onSelectDate={dayDate => this.onSelectDayDate(dayDate)}
        />
      </View>
    )
  }
}

const sharedStyles = StyleSheet.create({
  dateEntry: {
    textAlign: "center",
    alignSelf: "center",
  },
})

const styles = StyleSheet.create({
  list: {},
  defaultDateEntry: {
    ...sharedStyles.dateEntry,
  },
  referenceDateEntry: {
    ...sharedStyles.dateEntry,
    fontWeight: "bold",
  },
})

const mapStateToProps = ({ ui: { dailyHabitsList } }: ApplicationState) => ({
  enterCustomDateModalOpen: dailyHabitsList.enterCustomDateModalOpen,
})

const mapPropsToDispatch = (dispatch: DailyHabitsListThunkDispatch) => ({
  setSelectDateModalOpen: (open: boolean) => dispatch(setSelectDateModalOpenAction(open)),
  selectDate: (dayDate: DayDate) => dispatch(selectDateAction(dayDate)),
  setEnterCustomDateModalOpen: (open: boolean) => dispatch(setEnterCustomDateModalOpenAction(open)),
})

export default connect(
  mapStateToProps,
  mapPropsToDispatch
)(SelectDailyHabitsDateView)

export type ListEntryViewData = DateEntryViewData | EnterCustomDateViewData

export interface DateEntryViewData {
  kind: "date"
  key: string
  date: DailyListDayDateViewData
}

export interface EnterCustomDateViewData {
  kind: "enterCustomDate"
  key: string
}
