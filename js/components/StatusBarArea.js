import React, { Component } from "react";
import { View, StyleSheet, Platform } from "react-native";

export default class StatusBarArea extends Component {
  render() {
    return <View style={styles.statusBar} />;
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: Platform.OS === "ios" ? 18 : 25,
    backgroundColor: "white"
  }
});
