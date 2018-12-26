import React, { Component } from 'react';

import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Repo from '../Repo.js';

export default class EditHabitView extends Component {
    render() {
        return (
            <View style={{marginTop: 22}}>
                <View>
                <Text>Hello World!</Text>

                <TouchableHighlight
                    onPress={() => {
                        this.props.onClose();
                    }}>
                    <Text>Hide Modal</Text>
                </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});
