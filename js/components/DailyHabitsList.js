import React, { Component } from 'react';

import { FlatList, StyleSheet, Text } from 'react-native';

export default class DailyHabitsList extends Component {
    render() {
        return (
            <FlatList 
                style={styles.list} 
                data={this.props.habits}
                renderItem={({item}) => <Text style={styles.habit}>{item.name}</Text>}
            />
        );
    }
}

const styles = StyleSheet.create({
    list: {},
    habit: {
        padding: 10,
        fontSize: 18,
        height: 44,
    }
});
