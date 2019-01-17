import React from "react"
import DailyHabitsList from "./components/DailyHabitsList"
import { ApplicationState } from "./redux/reducers/RootReducer"
import { connect } from "react-redux"
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import StatsView from './components/StatsView';

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

const TabNavigator = createBottomTabNavigator({
  Home: DailyHabitsListScreen,
  Stats: StatsScreen
});

const mapStateToProps = (state: ApplicationState) => ({})

export default connect<PropsFromState, PropsFromDispatch, OwnProps, ApplicationState>(mapStateToProps)(createAppContainer(TabNavigator))
