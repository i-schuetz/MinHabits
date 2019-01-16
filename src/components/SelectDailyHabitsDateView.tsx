import React, { Component } from "react"
import { StyleSheet, TextInput, View, FlatList, Text } from "react-native"
import NavigationBar from "react-native-navbar"
import { DayDate } from "../models/DayDate"
import * as DayDateHelpers from "../models/DayDate"
import * as DateUtils from "../utils/DateUtils"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import {
  MyThunkDispatch,
  setSelectDateModalOpenAction,
  selectDateAction
} from "../redux/reducers/ui/DailyHabitsListReducer"
import { DailyListDayDateViewData } from "../models/view_data/DailyListFormattedDayDate"
import * as DailyListFormattedDayDateHelpers from "../models/view_data/DailyListFormattedDayDate"
import { Order } from "../models/Order"

interface PropsFromState {}

interface PropsFromDispatch {
  setSelectDateModalOpen: typeof setSelectDateModalOpenAction
  selectDate: typeof selectDateAction
}

export interface OwnProps {
  referenceDate: DayDate // TODO redux
}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

class SelectDailyHabitsDateView extends Component<AllProps> {
  private textInput: React.RefObject<TextInput>

  constructor(props: AllProps) {
    super(props)

    this.textInput = React.createRef()
  }

  private generateWeekDayDates(dayDate: DayDate): DayDate[] {
    return DateUtils.getDayDatesInWeek(dayDate)
  }

  private format(dayDate: DayDate, isReferenceDate: boolean): DailyListDayDateViewData {
    return DailyListFormattedDayDateHelpers.fromDayDate(dayDate, isReferenceDate)
  }

  private generateWeekDayDatesViewData(dayDate: DayDate): DailyListDayDateViewData[] {
    return this.generateWeekDayDates(dayDate).map(dd =>
      this.format(dd, DayDateHelpers.compare(dayDate, dd) == Order.EQ)
    )
  }

  private onSelectDayDate(dayDate: DayDate) {
    this.props.selectDate(dayDate)
  }

  render() {
    const leftButtonConfig = {
      title: "x",
      handler: () => this.props.setSelectDateModalOpen(false)
    }

    const titleConfig = {
      title: "Dates"
    }

    return (
      <View>
        <NavigationBar title={titleConfig} leftButton={leftButtonConfig} />
        <FlatList
          data={this.generateWeekDayDatesViewData(this.props.referenceDate)}
          keyExtractor={(item: DailyListDayDateViewData, {}) => item.formatted}
          style={styles.list}
          renderItem={({ item }) => (
            <Text
              style={item.isReferenceDate ? styles.referenceDateEntry : styles.defaultDateEntry}
              onPress={() => this.onSelectDayDate(item.dayDate)}
            >
              {item.formatted}
            </Text>
          )}
        />
      </View>
    )
  }
}

const sharedStyles = StyleSheet.create({
  dateEntry: {
    height: 40
  }
})

const styles = StyleSheet.create({
  list: {},
  defaultDateEntry: {
    ...sharedStyles.dateEntry,
    color: "blue"
  },
  referenceDateEntry: {
    ...sharedStyles.dateEntry,
  }
})

const mapStateToProps = ({ ui: { dailyHabitsList } }: ApplicationState) => ({})
const mapPropsToDispatch = (dispatch: MyThunkDispatch) => ({
  setSelectDateModalOpen: (open: boolean) => dispatch(setSelectDateModalOpenAction(open)),
  selectDate: (dayDate: DayDate) => dispatch(selectDateAction(dayDate))
})

export default connect(
  mapStateToProps,
  mapPropsToDispatch
)(SelectDailyHabitsDateView)
