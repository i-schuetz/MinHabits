import React from "react"
import { ApplicationState } from "./redux/reducers/RootReducer"
import { connect } from "react-redux"
import { StyleSheet, View, Modal, Text, Button, TouchableWithoutFeedback, Image } from "react-native"
import TabsContainer from "./TabsContainer"
import NavigationBar from "react-native-navbar"
import {
  closeHabitsNeedAttentionPopupAction,
  AppReducerThunkDispatch,
  closeCongratsPopupOpenAction,
  CongratsPopupState,
  HabitsNeedAttentionPopupState,
  HabitsNeedAttentionPopupContents,
  CongratsPopupContents,
  deleteHabitsNeedingAttentionAction,
  willDoNeedAttentionHabitsAction,
} from "./redux/reducers/ui/AppReducer"
import { Habit } from "./models/Habit"
import * as SharedStyles from "./SharedStyles"
import { globalStyles, closeModalImage } from "./SharedStyles"

interface PropsFromState {
  habitsNeedAttentionPopupState: HabitsNeedAttentionPopupState
  congratsPopupState: CongratsPopupState
}

interface PropsFromDispatch {
  closeHabitsNeedAttentionPopup: typeof closeHabitsNeedAttentionPopupAction
  closeCongratsPopup: typeof closeCongratsPopupOpenAction
  deleteNeedAttentionHabits: typeof deleteHabitsNeedingAttentionAction
  willDoNeedAttentionHabits: typeof willDoNeedAttentionHabitsAction
}
interface OwnProps {}
type AllProps = PropsFromState & PropsFromDispatch & OwnProps

class App extends React.Component<AllProps, any> {
  private isHabitsNeedAttentionPopupVisible(): boolean {
    return this.props.habitsNeedAttentionPopupState.kind == "open"
  }

  private habitsNeedAttentionPopupView() {
    switch (this.props.habitsNeedAttentionPopupState.kind) {
      case "open":
        return this.toHabitsNeedAttentionPopupView(this.props.habitsNeedAttentionPopupState.contents)
      case "closed":
        return <View />
    }
  }

  private toHabitsNeedAttentionPopupView(contents: HabitsNeedAttentionPopupContents) {
    const closeButtonConfig = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.closeHabitsNeedAttentionPopup()
          }}
        >
          <Image
            style={{ width: 30, height: 30, marginTop: 10, marginRight: 15 }}
            source={require("../assets/close.png")}
          />
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View>
        <NavigationBar
          title={{ title: contents.title }}
          rightButton={closeButtonConfig()}
          style={globalStyles.navigationBar}
        />
        <Text>{contents.introduction}</Text>
        <Text>{contents.habitsNamesString}</Text>
        <Text>{contents.callToAction}</Text>
        <Button
          title={contents.willDoButtonLabel}
          onPress={() => this.props.willDoNeedAttentionHabits(contents.habits)}
        />
        <Button
          title={contents.removeHabitsButtonLabel}
          onPress={() => this.props.deleteNeedAttentionHabits(contents.habits)}
        />
      </View>
    )
  }

  private congratsPopupView() {
    switch (this.props.congratsPopupState.kind) {
      case "open":
        return this.toCongratsPopupView(this.props.congratsPopupState.contents)
      case "closed":
        return <View />
    }
  }

  private toCongratsPopupView(contents: CongratsPopupContents) {
    const closeButtonConfig = () => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.closeCongratsPopup()
          }}
        >
        {closeModalImage()}
        </TouchableWithoutFeedback>
      )
    }

    return (
      <View>
        <NavigationBar
          title={{ title: contents.title }}
          rightButton={closeButtonConfig()}
          style={globalStyles.navigationBar}
        />
        <Text>{contents.description}</Text>
        <Text>{contents.callToAction}</Text>
        <Button title={contents.okButtonLabel} onPress={() => this.props.closeCongratsPopup()} />
      </View>
    )
  }

  private isCongratsModalVisible(): boolean {
    return this.props.congratsPopupState.kind == "open"
  }

  render() {
    return (
      <View style={styles.container}>
        <TabsContainer />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.isHabitsNeedAttentionPopupVisible()}
          onRequestClose={() => {
            this.props.closeHabitsNeedAttentionPopup()
          }}
        >
          {this.habitsNeedAttentionPopupView()}
        </Modal>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.isCongratsModalVisible()}
          onRequestClose={() => {
            this.props.closeCongratsPopup()
          }}
        >
          {this.congratsPopupView()}
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
})

const mapStateToProps = ({ ui: { app } }: ApplicationState) => ({
  habitsNeedAttentionPopupState: app.needAttentionPopupState,
  congratsPopupState: app.congratsPopupState,
})

const mapDispatchToProps = (dispatch: AppReducerThunkDispatch) => ({
  closeHabitsNeedAttentionPopup: () => dispatch(closeHabitsNeedAttentionPopupAction()),
  closeCongratsPopup: () => dispatch(closeCongratsPopupOpenAction()),
  deleteNeedAttentionHabits: (habits: Habit[]) => dispatch(deleteHabitsNeedingAttentionAction(habits)),
  willDoNeedAttentionHabits: (habits: Habit[]) => dispatch(willDoNeedAttentionHabitsAction(habits)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
