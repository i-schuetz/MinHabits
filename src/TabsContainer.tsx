import React from "react"
import DailyHabitsList from "./components/DailyHabitsList"
import { ApplicationState } from "./redux/reducers/RootReducer"
import { connect } from "react-redux"
import { createBottomTabNavigator, createAppContainer } from "react-navigation"
import StatsView from "./components/StatsView"
import SettingsView from "./components/SettingsView"
import { Image } from "react-native"

interface PropsFromState {}
interface PropsFromDispatch {}
interface OwnProps {}

class DailyHabitsListScreen extends React.Component {
  render() {
    return <DailyHabitsList />
  }
}

class StatsScreen extends React.Component {
  render() {
    return <StatsView />
  }
}

class SettingsScreen extends React.Component {
  render() {
    return <SettingsView />
  }
}

const TabNavigator = createBottomTabNavigator(
  {
    Tasks: {
      screen: DailyHabitsListScreen,
      navigationOptions: {
        showLabel: false,
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <Image style={{ width: 30, height: 30, tintColor: tintColor }} source={require("../assets/check.png")} />
        ),
      },
    },
    Stats: {
      screen: StatsScreen,
      navigationOptions: {
        showLabel: false,
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <Image style={{ width: 30, height: 30, tintColor: tintColor }} source={require("../assets/bars.png")} />
        ),
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        showLabel: false,
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <Image style={{ width: 30, height: 30, tintColor: tintColor }} source={require("../assets/settings.png")} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: "#000",
      inactiveTintColor: "#ccc",
      showLabel: false,
    },
  }
)

const mapStateToProps = (state: ApplicationState) => ({})

export default connect<PropsFromState, PropsFromDispatch, OwnProps, ApplicationState>(mapStateToProps)(
  createAppContainer(TabNavigator)
)
