import React from "react"
import DailyHabitsList from "./components/DailyHabitsList"
import { ApplicationState } from "./redux/reducers/RootReducer"
import { connect } from "react-redux"
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';

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

const TabNavigator = createBottomTabNavigator({
  Tasks: DailyHabitsListScreen,
  Stats: StatsScreen,
  Settings: SettingsScreen
});

const mapStateToProps = (state: ApplicationState) => ({})

export default connect<PropsFromState, PropsFromDispatch, OwnProps, ApplicationState>(mapStateToProps)(createAppContainer(TabNavigator))
