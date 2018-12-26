import React from 'react';
import { StyleSheet } from 'react-native';
import DailyHabitsList from './js/components/DailyHabitsList'

export default class App extends React.Component {
    render() {
        return (
            <DailyHabitsList />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
