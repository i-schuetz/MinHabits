import React, { Component } from "react"
import { Text, View, ScrollView, StyleSheet } from "react-native"
import { Habit } from "../models/Habit"
import NavigationBar from "react-native-navbar"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import { WholePercentage } from "../models/helpers/WholePercentage"
import * as WholePercentageHelpers from "../models/helpers/WholePercentage"
import { MonthPercentage } from "../models/helpers/MonthPercentage"
import { fetchAllStatsAction, StatsThunkDispatch } from "../redux/reducers/ui/StatsReducer"
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory-native"
import * as MonthHelpers from "../models/Month"
import * as DateUtils from "../utils/DateUtils"
import * as SharedStyles from "../SharedStyles"
import { globalStyles } from "../SharedStyles"

interface PropsFromState {
  totalDonePercentage?: WholePercentage
  monthDonePercentages: MonthPercentage[]
  needAttentionHabits: Habit[]
}

interface PropsFromDispatch {
  fetchAllStats: typeof fetchAllStatsAction
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface StatsViewState {}

class StatsView extends Component<AllProps, StatsViewState> {
  componentWillMount() {
    this.props.fetchAllStats()
  }

  private formatTotalDonePercentage(totalDonePercentage: WholePercentage | undefined): string {
    if (totalDonePercentage === undefined) {
      return "-"
    }
    return WholePercentageHelpers.toString(totalDonePercentage) + "%"
  }

  private needAttentionHabitsString(habits: Habit[]): string {
    return habits.reduce((rv, habit) => rv + (rv.length == 0 ? "" : ", ") + habit.name, "")
  }

  private chartData() {
    return this.props.monthDonePercentages.map(monthPercentage => {
      return {
        x: DateUtils.monthShortName(monthPercentage.month),
        y: WholePercentageHelpers.toNumber(monthPercentage.percentage),
      }
    })
  }

  render() {
    // console.log("!!! render " + JSON.stringify(this.props.monthDonePercentages))

    return (
      <View>
        <NavigationBar
          title={<Text style={globalStyles.navBarTitleText}>{"Stats"}</Text>}
          style={globalStyles.navigationBar}
        />
        <ScrollView>
          <View style={styles.globalPercentageRow}>
            <Text style={styles.globalPercentage}>
              {this.formatTotalDonePercentage(this.props.totalDonePercentage)}
            </Text>
          </View>
          <View style={styles.chartRow}>
            {/* NOTE: Android fix: if we don't return null when length is 0 the chart renders no data!
            Apparently it can't handle updates in quick succession? (this is called 3x, in the first one the array is empty)  */}
            {this.props.monthDonePercentages.length == 0 ? null : (
              <VictoryChart domainPadding={8}>
                <VictoryBar
                  categories={{
                    x: DateUtils.last12Months().map(month => DateUtils.monthShortName(month)),
                    y: [],
                  }}
                  data={this.chartData()}
                />

                <VictoryAxis
                  label=""
                  style={{
                    axisLabel: { fontSize: 0, padding: 0, angle: 0 },
                    tickLabels: { fontSize: 14, marginTop: 10, angle: 45 },
                  }}
                />

                <VictoryAxis
                  dependentAxis
                  tickValues={[50, 100]}
                  // domain={[0, 100]}
                  tickFormat={tick => `${tick}%`}
                  offsetX={50}
                  orientation="left"
                  standalone={false}
                  style={{
                    grid: {
                      stroke: "#000",
                      strokeWidth: 0.5,
                    },
                    axisLabel: { fontSize: 0, padding: 0, angle: 0 },
                    tickLabels: { fontSize: 14, marginTop: 0, angle: 0 },
                    // ticks: { strokeWidth: 1 },
                    axis: { stroke: "#00000000", strokeWidth: 0 },
                  }}
                />
              </VictoryChart>
            )}
          </View>
          <View style={styles.needsAttentionRow}>
            {this.props.needAttentionHabits.length === 0 ? null : (
              <Text style={{}}>{"Attention: " + this.needAttentionHabitsString(this.props.needAttentionHabits)}</Text>
            )}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const sharedStyles = StyleSheet.create({
  withBottomBorder: {
    borderBottomColor: SharedStyles.dividersGrey,
    borderBottomWidth: SharedStyles.dividersHeight,
  },
})

const styles = StyleSheet.create({
  globalPercentageRow: {
    ...sharedStyles.withBottomBorder,
  },
  globalPercentage: {
    marginTop: 40,
    marginBottom: 40,
    fontSize: 40,
    textAlign: "center",
    alignSelf: "center",
    paddingLeft: SharedStyles.defaultSideMargins,
    paddingRight: SharedStyles.defaultSideMargins,
    fontWeight: "bold",
  },
  chartRow: {
    marginLeft: -20,
    ...sharedStyles.withBottomBorder,
    paddingLeft: SharedStyles.defaultSideMargins,
    paddingRight: SharedStyles.defaultSideMargins,
  },
  needsAttentionRow: {
    marginTop: 40,
    marginBottom: 40,
    paddingLeft: SharedStyles.defaultSideMargins,
    paddingRight: SharedStyles.defaultSideMargins,
  },
})

const mapStateToProps = ({ ui: { stats } }: ApplicationState) => ({
  totalDonePercentage: stats.totalDonePercentage,
  monthDonePercentages: stats.monthDonePercentages,
  needAttentionHabits: stats.needAttentionHabits,
})
const mapDispatchToProps = (dispatch: StatsThunkDispatch) => ({
  fetchAllStats: () => dispatch(fetchAllStatsAction()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatsView)
