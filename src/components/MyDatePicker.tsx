import React, { Component } from "react"
import DatePicker from "react-native-datepicker"
import { DayDate } from "../models/DayDate"
import * as DateUtils from "../utils/DateUtils"

export interface MyDatePickerProps {
  date: DayDate

  // Show clickable icon/input. If false nothing will be visible and picker has to be opened manually (calling open())
  showSelector: boolean 
  
  onSelectDate: (dayDate: DayDate) => void
}

export interface MyDatePickerState {
  date: DayDate
}

export default class MyDatePicker extends Component<MyDatePickerProps, MyDatePickerState> {
  private datePicker: React.RefObject<DatePicker>

  constructor(props: MyDatePickerProps) {
    super(props)
    this.datePicker = React.createRef()
    this.state = { date: props.date }
  }

  open = () => {
    if (this.datePicker.current !== null) {
      this.datePicker.current.onPressDate()
    } else {
      console.log("Can't open picker: Ref is null")
    }
  }

  private selectedStringDate(): { formatted: string; format: string } {
    return this.toString(this.state.date)
  }

  private onSelectDate(dateString: string) {
    const date = this.parseDateString(dateString)
    this.props.onSelectDate(date)
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
        showIcon={this.props.showSelector}
        hideText={!this.props.showSelector}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: "absolute",
            left: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            marginLeft: 36,
          },
        }}
        ref={this.datePicker}
        onDateChange={date => {
          this.onSelectDate(date)
        }}
      />
    )
  }
}
