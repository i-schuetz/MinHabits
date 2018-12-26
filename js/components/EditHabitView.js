import React, { Component } from 'react';

import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import NavigationBar from 'react-native-navbar';
import Repo from '../Repo.js';

export default class EditHabitView extends Component {
    render() {
        const leftButtonConfig = {
            title: 'x',
            handler: () => this.props.onClose()
        };
        
        const titleConfig = {
            title: 'Add habit',
        };
        return (
            <View>
                <NavigationBar
                    title={titleConfig}
                    leftButton={leftButtonConfig}
                />
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
