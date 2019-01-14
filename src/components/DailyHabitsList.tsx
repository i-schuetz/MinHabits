import React, { Component, Dispatch } from "react"

import { FlatList, Modal, StyleSheet, Text, View } from "react-native"
import { Habit } from "../models/Habit"
import NavigationBar from "react-native-navbar"
import Repo from "../Repo"
import EditHabitView from "./EditHabitView"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import { PayloadAction } from "typesafe-actions/dist/types"
import { DailyHabitsListActionTypes } from '../redux/reducers/ui/DailyHabitsListReducer';
import { openEditHabitModalAction } from "../redux/reducers/ui/DailyHabitsListReducer";

interface PropsFromState {
  editHabitModalOpen: boolean
}

interface PropsFromDispatch {
  setEditHabitModalOpen: typeof openEditHabitModalAction
}

interface OwnProps {}

type DailyHabitsLayoutContainerProps = PropsFromState & PropsFromDispatch & OwnProps

export interface DailyHabitsState {
  habits: Habit[]
  selectedHabit?: Habit
}

class DailyHabitsList extends Component<DailyHabitsLayoutContainerProps, DailyHabitsState> {
  state: DailyHabitsState = {
    habits: []
  }

  componentWillMount() {
    this.updateHabits()
  }

  private updateHabits = async () => {
    try {
      await Repo.init() // TODO only at app init (but async...), or prebundled db?
      const habits = await Repo.loadItems()
      console.log("updating list with items: " + JSON.stringify(habits))
      this.setState({ habits: habits })
    } catch (error) {
      console.error("Error loading habits. ", error)
    }
  }

  private submitHabit = async (habit: Habit) => {
    console.log("Submitting habit: " + JSON.stringify(habit))
    this.setModalVisible(false)
    await Repo.addHabit(habit)
    this.updateHabits()
  }

  private setModalVisible(visible: boolean) {
    this.props.setEditHabitModalOpen(visible)
    this.setState({ selectedHabit: visible ? this.state.selectedHabit : undefined })
  }

  private onSelectHabit(habit: Habit) {
    this.setState({ selectedHabit: habit }, () => this.setModalVisible(true))
  }

  render() {
    const rightButtonConfig = {
      title: "+",
      handler: () => this.setModalVisible(!this.props.editHabitModalOpen)
    }

    const titleConfig = {
      title: "Habits"
    }

    return (
      <View>
        <NavigationBar title={titleConfig} rightButton={rightButtonConfig} />
        <FlatList
          data={this.state.habits}
          keyExtractor={(item, {}) => item.name}
          style={styles.list}
          renderItem={({ item }) => (
            <Text style={styles.habit} onPress={({}) => this.onSelectHabit(item)}>
              {item.name}
            </Text>
          )}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.props.editHabitModalOpen}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}
        >
          <EditHabitView
            habit={this.state.selectedHabit}
            onSubmit={(habit: Habit) => {
              this.setModalVisible(false)
              this.submitHabit(habit)
            }}
            onClose={() => {
              this.setModalVisible(false)
            }}
          />
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = ({ ui: { dailyHabitsList } }: ApplicationState) => ({
  editHabitModalOpen: dailyHabitsList.editHabitModalOpen
})

const mapDispatchToProps = (dispatch: Dispatch<PayloadAction<DailyHabitsListActionTypes, boolean>>) => ({
  setEditHabitModalOpen: (open: boolean) => dispatch(openEditHabitModalAction(open))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DailyHabitsList)

const styles = StyleSheet.create({
  list: {},
  habit: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
})
