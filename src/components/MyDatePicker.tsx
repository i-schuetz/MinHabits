import React, { Component } from "react"
import DatePicker from "react-native-datepicker"
import { DayDate } from "../models/DayDate"
import * as DateUtils from "../utils/DateUtils"

export interface MyDatePickerProps {
  date: DayDate
  onSelectDate: (dayDate: DayDate) => void
}

export interface MyDatePickerState {
  date: DayDate
}

export default class MyDatePicker extends Component<MyDatePickerProps, MyDatePickerState> {
  constructor(props: MyDatePickerProps) {
    super(props)
    this.state = { date: props.date }
  }

  private selectedStringDate(): { formatted: string; format: string } {
    return this.toString(this.state.date)
  }

  private onSelectDate(dateString: string) {
    const dayDate = this.parseDateString(dateString)
    this.setState({ date: dayDate })
    this.props.onSelectDate(dayDate)
  }

  private minDateString(): string {
    return this.toString(DateUtils.today()).formatted
  }

  private maxDateString(): string {
    return this.toString({ day: 1, month: 1, year: 2200 }).formatted
  }

  private toString(dayDate: DayDate): { formatted: string; format: string } {
    return DateUtils.toDayDateString(dayDate)
  }

  private parseDateString(dateString: string): DayDate {
    return DateUtils.parseDayDate(dateString)
  }

  render() {
    return (
      <DatePicker
        style={{ width: 200 }}
        date={this.selectedStringDate().formatted}
        mode="date"
        placeholder="select date"
        format={this.selectedStringDate().format}
        minDate={this.minDateString()}
        maxDate={this.maxDateString()}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: "absolute",
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }
        }}
        onDateChange={date => {
          this.onSelectDate(date)
        }}
      />
    )
  }
}
