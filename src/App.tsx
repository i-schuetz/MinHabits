import React from "react"
import { StyleSheet, View } from "react-native"
import DailyHabitsList from "./components/DailyHabitsList"
import { ApplicationState } from "./redux/reducers/RootReducer"
import { connect } from "react-redux"

interface PropsFromState {}
interface PropsFromDispatch {}
interface OwnProps {}
type AllProps = PropsFromState & PropsFromDispatch & OwnProps

class App extends React.Component<AllProps, any> {
  render() {
    return (
      <View style={styles.container}>
        <DailyHabitsList />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
})

const mapStateToProps = (state: ApplicationState) => ({})

export default connect<PropsFromState, PropsFromDispatch, OwnProps, ApplicationState>(mapStateToProps)(App)
