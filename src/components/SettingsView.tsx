import React, { Component, ReactNode } from "react"

import { FlatList, StyleSheet, Text, View, Modal } from "react-native"
import NavigationBar from "react-native-navbar"
import { ApplicationState } from "../redux/reducers/RootReducer"
import { connect } from "react-redux"
import { StatsThunkDispatch } from "../redux/reducers/ui/StatsReducer"
import { SettingsScreenEntry, setModalOpenAction } from "../redux/reducers/ui/SettingsReducer"
import * as EmailUtils from "../utils/EmailUtils"
import ManageHabitsView from "./ManageHabitsView"

interface PropsFromState {
  modalOpen?: SettingsScreenEntry
}

interface PropsFromDispatch {
  setModalOpen: typeof setModalOpenAction
}

interface OwnProps {}

type AllProps = PropsFromState & PropsFromDispatch & OwnProps

export interface StatsViewState {}

type SettingEntryData = {
  entry: SettingsScreenEntry
  name: string
}

class SettingsView extends Component<AllProps, StatsViewState> {
  private settings: SettingEntryData[] = [
    { entry: SettingsScreenEntry.MANAGE_HABITS, name: "Manage habits" },
    { entry: SettingsScreenEntry.FEEDBACK, name: "Feedback" },
    { entry: SettingsScreenEntry.ABOUT, name: "About" },
  ]

  /**
   * This function should never return undefined. Unless we forget to add a setting entry data for a setting entry.
   */
  private getSettingsData(entry: SettingsScreenEntry): SettingEntryData | undefined {
    return this.settings.find(setting => setting.entry == entry)
  }

  private onPressSetting(setting: SettingsScreenEntry) {
    switch (setting) {
      case SettingsScreenEntry.FEEDBACK:
        EmailUtils.openFeedbackEmail() // open directly, without redux
        break
      default:
        this.props.setModalOpen(setting, true)
    }
  }

  // TODO review if this is proper way to generate modals on demand (variable content):
  // when the redux state sets modal to undefined (i.e. modal should be closed), 2 things are happening at the same time:
  // 1. visible prop of existing modal is set to false - this triggers the animation to hide it
  // 2. render runs, where maybeModal() is called, which returns undefined - this essentially is removing the modal (?)
  // so is it possible that 1. and 2. conflict with each other?
  // at the moment appears to work, on the iOS simlator at least.
  private wrapInModal(entryData: SettingEntryData, content: ReactNode) {
    const leftButtonConfig = {
      title: "x",
      handler: () => this.props.setModalOpen(entryData.entry, false),
    }

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalOpen !== undefined}
        onRequestClose={() => {
          this.props.setModalOpen(entryData.entry, false)
        }}
      >
        <View>
          <NavigationBar title={<Text>{entryData.name}</Text>} leftButton={leftButtonConfig} />
          {content}
        </View>
      </Modal>
    )
  }

  private maybeModal(): ReactNode | undefined {
    const modal = this.props.modalOpen
    if (modal !== undefined) {
      const entryData = this.getSettingsData(modal)
      if (entryData !== undefined) {
        return this.wrapInModal(entryData, this.createSettingsView(entryData))
      } else {
        return undefined
      }
    } else {
      return undefined
    }
  }

  private createSettingsView(entryData: SettingEntryData): ReactNode | undefined {
    switch (entryData.entry) {
      case SettingsScreenEntry.MANAGE_HABITS:
        return <ManageHabitsView />
      case SettingsScreenEntry.ABOUT:
        return (
          <View>
            <Text>{"Ivan Schuetz"}</Text>
            <Text>{"Birkenstraße 15"}</Text>
            <Text>{"10559 Berlin"}</Text>
            <Text>{"Germany"}</Text>
            <Text>{"VATIN: DE289356506"}</Text>
          </View>
        )
      case SettingsScreenEntry.FEEDBACK:
        return undefined
    }
  }

  render() {
    return (
      <View>
        <NavigationBar title={<Text>{"Settings"}</Text>} />
        <FlatList
          data={this.settings}
          keyExtractor={(item, {}) => item.name}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.settingName} onPress={({}) => this.onPressSetting(item.entry)}>
                {item.name}
              </Text>
            </View>
          )}
        />
        {this.maybeModal()}
      </View>
    )
  }
}

const mapStateToProps = ({ ui: { settings } }: ApplicationState) => ({
  modalOpen: settings.modalOpen,
})
const mapDispatchToProps = (dispatch: StatsThunkDispatch) => ({
  setModalOpen: (entry: SettingsScreenEntry, open: boolean) => dispatch(setModalOpenAction(entry, open)),
})

const styles = StyleSheet.create({
  list: {},
  row: {},
  settingName: {},
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsView)
